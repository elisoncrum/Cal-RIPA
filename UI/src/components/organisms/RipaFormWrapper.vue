<template>
  <div class="ripa-form-wrapper">
    <v-card class="mx-auto" max-width="900" outlined>
      <v-card-text>
        <template v-if="stepIndex == 0">
          <ripa-template
            :on-open-template="onOpenTemplate"
            :stopTemplates="stopTemplates"
          ></ripa-template>
        </template>
        <template v-if="stepIndex >= 1 && stepIndex <= 7">
          <v-stepper v-model="stepIndex">
            <v-stepper-header>
              <v-stepper-step :complete="stepIndex > 1" step="1">
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepIndex > 2" step="2">
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepIndex > 3" step="3">
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepIndex > 4" step="4">
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepIndex > 5" step="5">
              </v-stepper-step>

              <v-divider></v-divider>

              <template v-if="anyAgencyQuestions">
                <v-stepper-step :complete="stepIndex > 6" step="6">
                </v-stepper-step>

                <v-divider></v-divider>
              </template>

              <v-stepper-step
                class="ripa-form-wrapper--summary-step-top"
                step="7"
              ></v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <template v-if="stepIndex === 1">
                  <ripa-form-step-1
                    v-model="stop"
                    :on-next="handleNext"
                    :on-cancel="handleCancel"
                    :beats="beats"
                    :county-cities="countyCities"
                    :display-user-edit="displayUserEdit"
                    :display-beat-input="displayBeatInput"
                    :isOnlineAndAuthenticated="isOnlineAndAuthenticated"
                    :admin-editing="adminEditing"
                    :last-location="lastLocation"
                    :loading-gps="loadingGps"
                    :loading-pii="loadingPiiStep1"
                    :non-county-cities="nonCountyCities"
                    :schools="schools"
                    :user="user"
                    :valid-last-location="validLastLocation"
                    :on-open-favorites="onOpenLocationFavorites"
                    :on-open-last-location="onOpenLastLocation"
                    :on-open-statute="onOpenStatute"
                    :on-save-favorite="onSaveLocationFavorite"
                    :on-gps-location="onGpsLocation"
                    :on-update-user="onUpdateUser"
                    @input="handleInput"
                    @pii-check="handlePiiCheck"
                  ></ripa-form-step-1>
                </template>
              </v-stepper-content>

              <v-stepper-content step="2">
                <template v-if="stepIndex === 2">
                  <ripa-subheader
                    class="tw-text-right"
                    :text="getEditPersonText"
                    no-margins
                  ></ripa-subheader>

                  <ripa-form-step-2
                    v-model="stop"
                    :disabled="isFormStep2Disabled"
                    :on-back="handleBack"
                    :on-next="handleNext"
                    :on-cancel="handleCancel"
                    :on-open-statute="onOpenStatute"
                    :back-button-visible="getFormStep2BackButtonVisible"
                    @input="handleInput"
                  ></ripa-form-step-2>
                </template>
              </v-stepper-content>

              <v-stepper-content step="3">
                <template v-if="stepIndex === 3">
                  <ripa-subheader
                    class="tw-text-right"
                    :text="getEditPersonText"
                    no-margins
                  ></ripa-subheader>

                  <ripa-form-step-3
                    v-model="stop"
                    :isOnlineAndAuthenticated="isOnlineAndAuthenticated"
                    :last-reason="lastReason"
                    :loading-pii="loadingPiiStep3"
                    :on-back="handleBack"
                    :on-next="handleNext"
                    :on-cancel="handleCancel"
                    :on-open-favorites="onOpenReasonFavorites"
                    :on-open-statute="onOpenStatute"
                    :on-save-favorite="onSaveReasonFavorite"
                    :statutes="statutes"
                    @input="handleInput"
                    @pii-check="handlePiiCheck"
                  ></ripa-form-step-3>
                </template>
              </v-stepper-content>

              <v-stepper-content step="4">
                <template v-if="stepIndex === 4">
                  <ripa-subheader
                    class="tw-text-right"
                    :text="getEditPersonText"
                    no-margins
                  ></ripa-subheader>

                  <ripa-form-step-4
                    v-model="stop"
                    :loading-pii="loadingPiiStep4"
                    :on-back="handleBack"
                    :on-next="handleNext"
                    :on-cancel="handleCancel"
                    :on-open-statute="onOpenStatute"
                    :statutes="statutes"
                    @input="handleInput"
                    @pii-check="handlePiiCheck"
                  ></ripa-form-step-4>
                </template>
              </v-stepper-content>

              <v-stepper-content step="5">
                <template v-if="stepIndex === 5">
                  <ripa-subheader
                    class="tw-text-right"
                    :text="getEditPersonText"
                    no-margins
                  ></ripa-subheader>

                  <ripa-form-step-5
                    v-model="stop"
                    :isOnlineAndAuthenticated="isOnlineAndAuthenticated"
                    :last-result="lastResult"
                    :on-back="handleBack"
                    :on-next="handleNext"
                    :on-cancel="handleCancel"
                    :on-open-favorites="onOpenResultFavorites"
                    :on-open-statute="onOpenStatute"
                    :on-save-favorite="onSaveResultFavorite"
                    :statutes="statutes"
                    @input="handleInput"
                  ></ripa-form-step-5>
                </template>
              </v-stepper-content>

              <v-stepper-content step="6">
                <template v-if="stepIndex === 6">
                  <ripa-form-step-6
                    v-model="stop"
                    :on-back="handleBack"
                    :on-next="handleNext"
                    :on-cancel="handleCancel"
                    :back-button-visible="getFormStep6BackButtonVisible"
                    @input="handleInput"
                  ></ripa-form-step-6>
                </template>
              </v-stepper-content>

              <v-stepper-content step="7">
                <template v-if="stepIndex === 7">
                  <ripa-form-step-7
                    v-model="stop"
                    :admin-editing="adminEditing"
                    :api-stop="getApiStop"
                    :on-add-person="handleAddPerson"
                    :on-back="handleBack"
                    :on-copy-person="handleCopyPerson"
                    :on-delete-person="handleCallDeletePerson"
                    :on-edit-agency-questions="handleEditAgencyQuestions"
                    :on-edit-person="handleEditPerson"
                    :on-edit-stop="handleEditStop"
                    :on-submit="handleSubmit"
                    :on-cancel="handleCancel"
                    @input="handleInput"
                  ></ripa-form-step-7>
                </template>
              </v-stepper-content>
            </v-stepper-items>

            <v-stepper-header>
              <v-stepper-step :complete="stepIndex > 1" step="1">
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepIndex > 2" step="2">
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepIndex > 3" step="3">
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepIndex > 4" step="4">
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepIndex > 5" step="5">
              </v-stepper-step>

              <v-divider></v-divider>

              <template v-if="anyAgencyQuestions">
                <v-stepper-step :complete="stepIndex > 6" step="6">
                </v-stepper-step>

                <v-divider></v-divider>
              </template>

              <v-stepper-step
                class="ripa-form-wrapper--summary-step-bottom"
                step="7"
              ></v-stepper-step>
            </v-stepper-header>
          </v-stepper>

          <template v-if="displayDebugger">
            <v-btn class="tw-mt-3" text @click="handleDebugger">Debugger</v-btn>
          </template>
        </template>
        <template v-if="stepIndex === confirmationStepIndex">
          <ripa-confirmation :on-start-new="handleStartNew"></ripa-confirmation>
        </template>
      </v-card-text>
    </v-card>

    <ripa-json-viewer-dialog
      :stop="stop"
      :full-stop="fullStop"
      :api-stop="getApiStop"
      :show-dialog="showDialog"
      :on-close="handleCloseDialog"
    ></ripa-json-viewer-dialog>

    <ripa-confirm-dialog
      :show-dialog="showCancelFormDialog"
      title="Confirm Cancel"
      subtitle="Are you sure you want to cancel the form? You will lose all changes."
      :on-close="handleCloseDialog"
      :on-confirm="handleCancelForm"
    >
    </ripa-confirm-dialog>

    <ripa-confirm-dialog
      :show-dialog="showCancelActionDialog"
      title="Confirm Cancel"
      subtitle="Are you sure you want to cancel the action? You will lose all changes."
      :on-close="handleCloseDialog"
      :on-confirm="handleCancelAction"
    >
    </ripa-confirm-dialog>

    <ripa-confirm-dialog
      :show-dialog="showDeletePersonDialog"
      title="Confirm Delete"
      subtitle="Are you sure you want to delete the person?"
      :on-close="handleCloseDialog"
      :on-confirm="handleDeletePerson"
    >
    </ripa-confirm-dialog>

    <ripa-confirm-dialog
      :show-dialog="showConfirmDialog"
      title="Confirm Submission"
      subtitle="Are you sure you want to submit the form?"
      :on-close="handleCloseDialog"
      :on-confirm="handleConfirmSubmit"
    >
    </ripa-confirm-dialog>
  </div>
</template>

<script>
import RipaConfirmation from '@/components/molecules/RipaConfirmation'
import RipaConfirmDialog from '@/components/atoms/RipaConfirmDialog'
import RipaFormStep1 from '@/components/molecules/RipaFormStep1'
import RipaFormStep2 from '@/components/molecules/RipaFormStep2'
import RipaFormStep3 from '@/components/molecules/RipaFormStep3'
import RipaFormStep4 from '@/components/molecules/RipaFormStep4'
import RipaFormStep5 from '@/components/molecules/RipaFormStep5'
import RipaFormStep6 from '@/components/molecules/RipaFormStep6'
import RipaFormStep7 from '@/components/molecules/RipaFormStep7'
import RipaJsonViewerDialog from '@/components/molecules/RipaJsonViewerDialog'
import RipaSubheader from '@/components/atoms/RipaSubheader'
import RipaTemplate from '@/components/molecules/RipaTemplate'
import { fullStopToApiStop } from '@/utilities/stop'

export default {
  name: 'ripa-form-wrapper',

  components: {
    RipaConfirmation,
    RipaConfirmDialog,
    RipaFormStep1,
    RipaFormStep2,
    RipaFormStep3,
    RipaFormStep4,
    RipaFormStep5,
    RipaFormStep6,
    RipaFormStep7,
    RipaJsonViewerDialog,
    RipaSubheader,
    RipaTemplate,
  },

  data() {
    return {
      stepIndex: this.formStepIndex,
      confirmationStepIndex: 8,
      stop: this.value,
      stepTrace: null,
      showDialog: false,
      showCancelFormDialog: false,
      showCancelActionDialog: false,
      showConfirmDialog: false,
      showDeletePersonDialog: false,
      deletePersonId: null,
    }
  },

  computed: {
    anyAgencyQuestions() {
      const questions = this.stop?.agencyQuestions || []
      return questions.length > 0
    },

    displayUserEdit() {
      return !this.adminEditing
    },

    getEditPersonText() {
      const personIndex = this.stop.person?.index || 1
      return `Person: ${personIndex}`
    },

    getFormStep2BackButtonVisible() {
      return this.isCreateForm()
    },

    getFormStep6BackButtonVisible() {
      return this.isCreateForm()
    },

    getApiStop() {
      return fullStopToApiStop(
        this.isOnlineAndAuthenticated,
        this.fullStop,
        this.beats,
        this.countyCities,
        this.nonCountyCities,
        this.schools,
        this.statutes,
      )
    },

    isFormStep2Disabled() {
      return this.adminEditing && this.stepIndex === 2
    },
  },

  methods: {
    handleDebugger() {
      this.showDialog = true
    },

    handleCloseDialog() {
      this.showDialog = false
      this.showConfirmDialog = false
      this.showCancelFormDialog = false
      this.showCancelActionDialog = false
      this.showDeletePersonDialog = false
    },

    isCreateForm() {
      return (
        !this.isEditStop() &&
        !this.isEditPerson() &&
        !this.isEditAgencyQuestions()
      )
    },

    isEditStop() {
      const value = localStorage.getItem('ripa_form_edit_stop')
      return value ? value === '1' : false
    },

    isEditPerson() {
      const value = localStorage.getItem('ripa_form_edit_person')
      return value ? value === '1' : false
    },

    isEditAgencyQuestions() {
      const value = localStorage.getItem('ripa_form_edit_agency_questions')
      return value ? value === '1' : false
    },

    handleInput(newVal) {
      this.stop = Object.assign({}, newVal)
      this.$emit('input', this.stop)
    },

    handlePiiCheck({ source, value }) {
      this.$emit('pii-check', { source, value })
    },

    handleAddPerson() {
      this.stepIndex = 2
      if (this.onStepIndexChange) {
        this.onStepIndexChange(this.stepIndex)
      }
      if (this.onAddPerson) {
        this.onAddPerson()
      }
    },

    handleBack() {
      this.stepIndex = this.stepIndex - 1
      if (this.onStepIndexChange) {
        this.onStepIndexChange(this.stepIndex)
      }
      window.scrollTo(0, 0)
    },

    handleCancel() {
      if (
        this.isEditStop() ||
        this.isEditPerson() ||
        this.isEditAgencyQuestions()
      ) {
        this.showCancelActionDialog = true
      } else {
        this.showCancelFormDialog = true
      }
    },

    handleCancelForm() {
      this.stepIndex = 0
      if (this.onStepIndexChange) {
        this.onStepIndexChange(this.stepIndex)
      }
      if (this.onCancelForm) {
        this.onCancelForm()
      }
    },

    handleCancelAction() {
      if (this.onCancelAction) {
        this.onCancelAction()
      }
    },

    handleCopyPerson(id) {
      this.stepIndex = 2
      if (this.onStepIndexChange) {
        this.onStepIndexChange(this.stepIndex)
      }
      if (this.onCopyPerson) {
        this.onCopyPerson(id)
      }
    },

    handleCallDeletePerson(id) {
      this.deletePersonId = id
      this.showDeletePersonDialog = true
    },

    handleDeletePerson() {
      if (this.deletePersonId && this.onDeletePerson) {
        this.onDeletePerson(this.deletePersonId)
      }
    },

    handleEditPerson(id) {
      this.stepIndex = 2
      if (this.onStepIndexChange) {
        this.onStepIndexChange(this.stepIndex)
      }
      if (this.onEditPerson) {
        this.onEditPerson(id)
      }
    },

    handleEditStop() {
      this.stepIndex = 1
      if (this.onStepIndexChange) {
        this.onStepIndexChange(this.stepIndex)
      }
      if (this.onEditStop) {
        this.onEditStop()
      }
    },

    handleEditAgencyQuestions() {
      this.stepIndex = 6
      if (this.onStepIndexChange) {
        this.onStepIndexChange(this.stepIndex)
      }
      if (this.onEditAgencyQuestions) {
        this.onEditAgencyQuestions()
      }
    },

    getNextStepIndex() {
      if (!this.isCreateForm()) {
        if (this.isEditStop() && !this.isEditPerson()) {
          const stopReason = this.stop?.stopReason?.reasonForStop || null
          const validReason = stopReason !== null
          if (!validReason) {
            localStorage.removeItem('ripa_form_edit_stop')
            localStorage.setItem('ripa_form_edit_person', '1')
            return 3
          } else {
            return 7
          }
        }

        if (!this.isEditStop() && this.isEditPerson() && this.stepIndex === 5) {
          return 7
        }
      }

      if (this.isCreateForm()) {
        if (!this.anyAgencyQuestions && this.stepIndex === 5) {
          return 7
        }
      }

      return this.stepIndex + 1
    },

    handleNext() {
      this.stepIndex = this.getNextStepIndex()
      if (this.onStepIndexChange) {
        this.onStepIndexChange(this.stepIndex)
      }
      window.scrollTo(0, 0)
    },

    handleStartNew() {
      this.stepIndex = 0
      if (this.onStepIndexChange) {
        this.onStepIndexChange(this.stepIndex)
      }
      if (this.onCancelForm) {
        this.onCancelForm()
      }
    },

    handleSubmit() {
      this.showConfirmDialog = true
    },

    handleConfirmSubmit() {
      this.stepIndex = this.confirmationStepIndex
      if (this.onStepIndexChange) {
        this.onStepIndexChange(this.stepIndex)
      }
      if (this.onSubmitStop) {
        const apiStop = this.getApiStop
        console.log('Submitted Stop', apiStop)
        this.onSubmitStop(apiStop)
      }
      if (this.onCancelForm) {
        this.onCancelForm()
      }
    },

    createStepTrace(index, startTimeStamp) {
      if (!this.adminEditing) {
        this.stepTrace = {
          index,
          startTimeStamp,
        }
      }
    },

    updateStepTrace(endTimeStamp) {
      if (!this.adminEditing && this.stepTrace) {
        this.stepTrace.endTimeStamp = endTimeStamp
        this.stop.stepTrace.push(this.stepTrace)
      }
    },

    getFormSummaryStepText() {
      return this.anyAgencyQuestions ? '7' : '6'
    },

    updateFormStepNumbers() {
      this.$nextTick(() => {
        const [top] = document.getElementsByClassName(
          'ripa-form-wrapper--summary-step-top',
        )

        if (top) {
          const [firstSpan] = top.getElementsByClassName(
            'v-stepper__step__step',
          )
          if (firstSpan) {
            firstSpan.innerText = this.getFormSummaryStepText()
          }
        }

        const [bottom] = document.getElementsByClassName(
          'ripa-form-wrapper--summary-step-bottom',
        )

        if (bottom) {
          const [firstSpan] = bottom.getElementsByClassName(
            'v-stepper__step__step',
          )
          if (firstSpan) {
            firstSpan.innerText = this.getFormSummaryStepText()
          }
        }
      })
    },
  },

  watch: {
    value(newVal) {
      this.stop = newVal
    },

    formStepIndex(newVal, oldVal) {
      this.updateFormStepNumbers()
      if (newVal !== oldVal) {
        if (newVal > 0 && oldVal > 0 && oldVal < 7) {
          this.updateStepTrace(new Date())
        }
        if (newVal > 0 && newVal < 7) {
          this.createStepTrace(newVal, new Date())
        }
        if (newVal === 0) {
          this.stepTrace = null
        }
      }
      this.stepIndex = newVal
      if (this.onStepIndexChange) {
        this.onStepIndexChange(this.stepIndex)
      }
    },
  },

  props: {
    value: {
      type: Object,
      default: () => {},
    },
    adminEditing: {
      type: Boolean,
      default: false,
    },
    schools: {
      type: Array,
      default: () => [],
    },
    beats: {
      type: Array,
      default: () => [],
    },
    countyCities: {
      type: Array,
      default: () => [],
    },
    displayBeatInput: {
      type: Boolean,
      default: false,
    },
    displayDebugger: {
      type: Boolean,
      default: false,
    },
    formStepIndex: {
      type: Number,
      default: 1,
    },
    fullStop: {
      type: Object,
      default: () => {},
    },
    isAuthenticated: {
      type: Boolean,
      default: false,
    },
    isOnlineAndAuthenticated: {
      type: Boolean,
      default: false,
    },
    lastLocation: {
      type: Object,
      default: () => {},
    },
    lastReason: {
      type: Object,
      default: () => {},
    },
    lastResult: {
      type: Object,
      default: () => {},
    },
    loadingGps: {
      type: Boolean,
      default: false,
    },
    loadingPiiStep1: {
      type: Boolean,
      default: false,
    },
    loadingPiiStep3: {
      type: Boolean,
      default: false,
    },
    loadingPiiStep4: {
      type: Boolean,
      default: false,
    },
    nonCountyCities: {
      type: Array,
      default: () => [],
    },
    statutes: {
      type: Array,
      default: () => [],
    },
    user: {
      type: Object,
      default: () => {},
    },
    validLastLocation: {
      type: Boolean,
      default: false,
    },
    stopTemplates: {
      type: Array,
      default: () => [],
    },
    onAddPerson: {
      type: Function,
      default: () => {},
    },
    onCancelForm: {
      type: Function,
      default: () => {},
    },
    onCancelAction: {
      type: Function,
      default: () => {},
    },
    onCopyPerson: {
      type: Function,
      default: () => {},
    },
    onDeletePerson: {
      type: Function,
      default: () => {},
    },
    onEditAgencyQuestions: {
      type: Function,
      default: () => {},
    },
    onEditPerson: {
      type: Function,
      default: () => {},
    },
    onEditStop: {
      type: Function,
      default: () => {},
    },
    onOpenLocationFavorites: {
      type: Function,
      default: () => {},
    },
    onOpenReasonFavorites: {
      type: Function,
      default: () => {},
    },
    onOpenResultFavorites: {
      type: Function,
      default: () => {},
    },
    onOpenLastLocation: {
      type: Function,
      default: () => {},
    },
    onOpenStatute: {
      type: Function,
      default: () => {},
    },
    onSaveLocationFavorite: {
      type: Function,
      default: () => {},
    },
    onSaveReasonFavorite: {
      type: Function,
      default: () => {},
    },
    onSaveResultFavorite: {
      type: Function,
      default: () => {},
    },
    onStepIndexChange: {
      type: Function,
      default: () => {},
    },
    onSubmitStop: {
      type: Function,
      default: () => {},
    },
    onGpsLocation: {
      type: Function,
      default: () => {},
    },
    onOpenTemplate: {
      type: Function,
      default: () => {},
    },
    onUpdateUser: {
      type: Function,
      default: () => {},
    },
  },
}
</script>

<style lang="scss">
@media only screen and (max-width: 370px) {
  .v-stepper__step {
    padding: 16px !important;

    .v-stepper__step__step {
      height: 16px !important;
      min-width: 16px !important;
      width: 16px !important;
    }
  }
}

@media only screen and (max-width: 600px) {
  .v-stepper__content {
    padding: 16px 16px 8px;
  }
}
</style>
