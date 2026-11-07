import type { PageServerLoad } from "./$types";
import { PlanService } from "$lib/services/plan.service";
import { toPOJO } from "$lib/utils";

export const load: PageServerLoad = async () => {
  const plans = await PlanService.getActivePlans();
  return toPOJO({ plans });
};
