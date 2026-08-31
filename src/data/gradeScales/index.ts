import { GradeScale, UniversityId } from '../../types';
import { foundationGradeScale } from './foundation';
import { comsatsGradeScale } from './comsats';
import { numlGradeScale } from './numl';
import { iiuiGradeScale } from './iiui';
import { riphahGradeScale } from './riphah';
import { nutechGradeScale } from './nutech';
import { fastGradeScale } from './fast';
import { nustGradeScale, airGradeScale } from './nustAir';
import { bahriaGradeScale } from './bahria';

export const GRADE_SCALES: Record<UniversityId, GradeScale> = {
  foundation: foundationGradeScale,
  comsats: comsatsGradeScale,
  numl: numlGradeScale,
  iiui: iiuiGradeScale,
  riphah: riphahGradeScale,
  nutech: nutechGradeScale,
  fast: fastGradeScale,
  nust: nustGradeScale,
  air: airGradeScale,
  bahria: bahriaGradeScale,
};

export function getGradeScale(universityId: UniversityId): GradeScale {
  return GRADE_SCALES[universityId];
}
