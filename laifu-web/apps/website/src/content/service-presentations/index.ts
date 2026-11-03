import { divorceCoachingPresentationSchema } from "@/contracts/cms-service";
import divorceCoaching from "./divorce-coaching.json";

export const divorceCoachingFallback = divorceCoachingPresentationSchema.parse(divorceCoaching);

import { highConflictPresentationSchema } from "@/contracts/cms-high-conflict";
import highConflict from "./high-conflict-divorce.json";
export const highConflictFallback = highConflictPresentationSchema.parse(highConflict);
