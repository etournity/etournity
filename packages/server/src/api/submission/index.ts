import { SubmissionType } from './submission.type'
import { SubmissionQueries } from './submission.queries'
import {
  SubmissionMutations,
  SubmissionCreateInput,
} from './submission.mutations'

export const SubmissionSchema = [
  SubmissionType,
  SubmissionQueries,
  SubmissionMutations,
  SubmissionCreateInput,
]
