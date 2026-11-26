<script lang="ts">
  import type { DailyChartPoint } from "$lib/services/analytics.service";

  interface Props {
    data: DailyChartPoint[];
    metric?: "views" | "uniqueVisitors" | "ctas";
    metricLabel?: string;
    lineColor?: string;
    fillColor?: string;
    height?: number;
    primaryKey?: string;
    secondaryKey?: string;
    primaryLabel?: string;
    secondaryLabel?: string;
  }

  let {
    data = [],
    metric = "views",
    metricLabel = "Views",
    lineColor = "#2563EB", // Blue-600
    fillColor = "rgba(37, 99, 235, 0.15)",
    height = 240,
  }: Props = $props();

  let activeIndex = $state<number | null>(null);
  let svgWidth = $state(600);

  const values = $derived(data.map((d) => (d[metric] !== undefined ? (d[metric] as number) : 0)));
  const maxValue = $derived(Math.max(...values, 5));
  const roundedMax = $derived(Math.ceil(maxValue * 1.15));

  // Compute SVG Points
  const paddingX = 40;
  const paddingY = 24;
  const chartWidth = $derived(Math.max(svgWidth - paddingX * 2, 100));
  const chartHeight = $derived(Math.max(height - paddingY * 2, 80));

  const points = $derived(
    data.map((point, index) => {
      const x = paddingX + (index / Math.max(data.length - 1, 1)) * chartWidth;
      const val = point[metric] !== undefined ? (point[metric] as number) : 0;
      const y = paddingY + chartHeight - (val / Math.max(roundedMax, 1)) * chartHeight;
      return { x, y, point, val };
    })
  );

  // SVG Line path string
  const linePath = $derived.by(() => {
    if (points.length === 0) return "";
    return points.reduce((acc, curr, idx) => {
      if (idx === 0) return `M ${curr.x} ${curr.y}`;
      // Smooth cubic bezier or straight lines
      const prev = points[idx - 1];
      const cx = (prev.x + curr.x) / 2;
      return `${acc} C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
    }, "");
  });

  // SVG Area fill path string
  const areaPath = $derived.by(() => {
    if (points.length === 0) return "";
    const bottomY = paddingY + chartHeight;
    const first = points[0];
    const last = points[points.length - 1];
    return `${linePath} L ${last.x} ${bottomY} L ${first.x} ${bottomY} Z`;
  });

  // Y-axis grid ticks (4 levels)
  const yTicks = $derived([
    { val: roundedMax, y: paddingY },
    { val: Math.round(roundedMax * 0.66), y: paddingY + chartHeight * 0.33 },
    { val: Math.round(roundedMax * 0.33), y: paddingY + chartHeight * 0.66 },
    { val: 0, y: paddingY + chartHeight },
  ]);

  // X-axis label stride (show at most ~6-7 labels)
  const xLabelStride = $derived(Math.max(1, Math.floor(data.length / 6)));

  function handleMouseMove(e: MouseEvent) {
    const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(1, (clientX - paddingX) / chartWidth));
    const closestIndex = Math.round(ratio * (data.length - 1));
    if (closestIndex >= 0 && closestIndex < data.length) {
      activeIndex = closestIndex;
    }
  }

  function handleMouseLeave() {
    activeIndex = null;
  }
</script>

<div class="relative w-full overflow-hidden select-none" bind:clientWidth={svgWidth}>
  <!-- Hover Tooltip Floating Card -->
  {#if activeIndex !== null && points[activeIndex]}
    {@const active = points[activeIndex]}
    <div
      class="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full -top-1 px-3 py-2 rounded-xl bg-slate-900 text-white text-xs shadow-xl space-y-1 transition-all duration-75"
      style="left: {active.x}px; top: {Math.max(active.y - 12, 10)}px;"
    >
      <p class="text-[10px] text-slate-400 font-medium">{active.point.label}</p>
      <div class="flex items-center gap-2">
        <span class="h-2 w-2 rounded-full" style="background-color: {lineColor};"></span>
        <span class="font-bold">{active.val.toLocaleString()} {metricLabel}</span>
      </div>
      {#if active.point.ctas !== undefined}
        <p class="text-[10px] text-emerald-400 font-medium">
          {active.point.ctas} CTAs ({active.point.calls} calls, {active.point.whatsapps} chats)
        </p>
      {/if}
    </div>
  {/if}

  <svg
    viewBox="0 0 {svgWidth} {height}"
    class="w-full h-auto overflow-visible cursor-crosshair"
    onmousemove={handleMouseMove}
    onmouseleave={handleMouseLeave}
    role="img"
    aria-label="Analytics Time Series Chart"
  >
    <defs>
      <linearGradient id="areaGradient-{metric}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color={lineColor} stop-opacity="0.25" />
        <stop offset="100%" stop-color={lineColor} stop-opacity="0.0" />
      </linearGradient>
    </defs>

    <!-- Horizontal Grid Lines -->
    {#each yTicks as tick}
      <line
        x1={paddingX}
        y1={tick.y}
        x2={svgWidth - paddingX}
        y2={tick.y}
        stroke="#E2E8F0"
        stroke-dasharray="3 3"
        stroke-width="1"
      />
      <text
        x={paddingX - 8}
        y={tick.y + 4}
        text-anchor="end"
        class="text-[10px] fill-slate-400 font-medium tabular-nums"
      >
        {tick.val}
      </text>
    {/each}

    <!-- Filled Area -->
    {#if areaPath}
      <path d={areaPath} fill="url(#areaGradient-{metric})" />
    {/if}

    <!-- Main Line Curve -->
    {#if linePath}
      <path
        d={linePath}
        fill="none"
        stroke={lineColor}
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    {/if}

    <!-- X-Axis Labels -->
    {#each data as item, i}
      {#if i % xLabelStride === 0 || i === data.length - 1}
        {@const x = paddingX + (i / Math.max(data.length - 1, 1)) * chartWidth}
        <text
          x={x}
          y={height - 4}
          text-anchor="middle"
          class="text-[10px] fill-slate-400 font-medium"
        >
          {item.label}
        </text>
      {/if}
    {/each}

    <!-- Active Hover Guides & Dot -->
    {#if activeIndex !== null && points[activeIndex]}
      {@const active = points[activeIndex]}
      <!-- Vertical guide line -->
      <line
        x1={active.x}
        y1={paddingY}
        x2={active.x}
        y2={paddingY + chartHeight}
        stroke={lineColor}
        stroke-width="1.5"
        stroke-dasharray="2 2"
        opacity="0.7"
      />
      <!-- Active point halo & dot -->
      <circle cx={active.x} cy={active.y} r="6" fill={lineColor} opacity="0.3" />
      <circle cx={active.x} cy={active.y} r="3.5" fill="#FFFFFF" stroke={lineColor} stroke-width="2" />
    {/if}
  </svg>
</div>
