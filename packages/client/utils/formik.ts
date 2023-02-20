import { FormikErrors } from 'formik'
import { isObjectEmpty } from './isObjectEmpty'

/**
 * Helper to extend the manual validation of forms in a Formik instance.
 * On Validation, the internal Formik callbacks return an object with unmet requirements.
 * If this object is empty, the validation counts as fulfilled.
 * If this object is not empty, the validation is rejected.
 * @param validateForm Required: Provider of Formik validation
 * @param fulfillCallback Optional: Callback triggered on fulfilled validation
 * @param rejectCallback Optional: Callback triggered on rejected validation
 */
export const manualFormikFormValidation = async (
  validateForm: (values?: unknown) => Promise<FormikErrors<unknown>>,
  fulfillCallback?: (onFulfilled: FormikErrors<unknown>) => void,
  rejectCallback?: (onRejected: FormikErrors<unknown>) => void
): Promise<void | FormikErrors<unknown>> =>
  validateForm().then((res) => {
    if (isObjectEmpty(res)) {
      fulfillCallback?.(res)
    } else {
      console.error('Formik Validation rejected: ' + JSON.stringify(res))
      rejectCallback?.(res)
    }
  })
