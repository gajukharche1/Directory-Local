import type { PageServerLoad } from "./$types";
import { PlanService } from "$lib/services/plan.service";

export const load: PageServerLoad = async () => {
  const plans = await PlanService.getActivePlans();
  return { plans };
};
