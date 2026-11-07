// @ts-nocheck
import type { PageServerLoad } from "./$types";
import { PlanService } from "$lib/services/plan.service";

export const load = async () => {
  const plans = await PlanService.getActivePlans();
  return { plans };
};
;null as any as PageServerLoad;