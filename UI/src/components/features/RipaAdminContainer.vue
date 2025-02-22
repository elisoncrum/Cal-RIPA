<template>
  <div>
    <ripa-admin-template
      :loading="loading"
      :user="mappedUser"
      :beats="mappedAdminBeats"
      :cities="mappedAdminCities"
      :schools="mappedAdminSchools"
      :statutes="mappedAdminStatutes"
      :stops="mappedAdminStops"
      :submissions="mappedAdminSubmissions"
      :currentSubmission="mappedAdminSubmission"
      :users="mappedAdminUsers"
      :errorCodeSearch="mappedErrorCodeAdminSearch"
      :display-beat-input="displayBeatInput"
      :on-delete-beat="handleDeleteBeat"
      :on-edit-beat="handleEditBeat"
      :on-edit-user="handleEditUser"
      :on-upload-users="handleUploadUsers"
      :on-upload-domain="handleUploadDomain"
      :on-tab-change="handleTabChange"
      :savedFilters="savedFilterState"
      :historicalCpraReports="mappedAdminHistoricalCpraReports"
      :cpraReportStats="mappedAdminCpraReportStats"
      @handleCallErrorCodeSearch="handleCallErrorCodeSearch"
      @handleRedoItemsPerPage="handleRedoItemsPerPage"
      @handlePaginate="handlePaginate"
      @handleAdminFiltering="handleAdminFiltering"
      @handleUpdateSavedFilter="handleUpdateSavedFilter"
      @handleSubmissionDetailItemsPerPage="handleSubmissionDetailItemsPerPage"
      @handleSubmissionDetailPaginate="handleSubmissionDetailPaginate"
      @handleSubmitStops="handleSubmitStops"
      @handleSubmitAll="handleSubmitAll"
      @handleCreateCpraReport="handleCreateCpraReport"
      @handleDownloadCpraReport="handleDownloadCpraReport"
    ></ripa-admin-template>

    <ripa-snackbar :text="snackbarText" v-model="snackbarVisible">
    </ripa-snackbar>
  </div>
</template>

<script>
import RipaAdminTemplate from '@/components/templates/RipaAdminTemplate'
import RipaSnackbar from '@/components/atoms/RipaSnackbar'
import { mapGetters, mapActions } from 'vuex'

import _ from 'lodash'

export default {
  name: 'ripa-admin-container',

  components: {
    RipaAdminTemplate,
    RipaSnackbar,
  },

  data() {
    return {
      loading: false,
      snackbarText: null,
      snackbarVisible: false,
      savedFilterState: {},
    }
  },

  watch: {
    '$route.params': {
      handler: function (params) {
        if (params.submissionId) {
          this.handleTabChange('/admin/submissions')
        }
      },
      deep: true,
      immediate: true,
    },
  },

  computed: {
    ...mapGetters([
      'mappedAdminBeats',
      'mappedAdminCities',
      'mappedAdminSchools',
      'mappedAdminStatutes',
      'mappedAdminStops',
      'mappedAdminSubmissions',
      'mappedAdminSubmission',
      'mappedAdminUsers',
      'mappedErrorCodeAdminSearch',
      'displayBeatInput',
      'mappedAdminCpraReportStats',
      'mappedAdminHistoricalCpraReports',
      'mappedUser',
    ]),
  },

  methods: {
    ...mapActions([
      'deleteBeat',
      'editBeat',
      'editUser',
      'uploadUsers',
      'uploadDomain',
      'getAdminBeats',
      'getAdminCities',
      'getAdminSchools',
      'getAdminStatutes',
      'getAdminStops',
      'getAdminUsers',
      'getAdminSubmissions',
      'getAdminSubmission',
      'getErrorCodes',
      'submitStops',
      'submitAllStops',
      'createCpraReport',
      'downloadCpraReport',
      'getHistoricalCpraReports',
    ]),

    async handleCallErrorCodeSearch(val) {
      this.getErrorCodes(val)
    },

    async handleTabChange(tabIndex) {
      this.loading = true
      if (
        tabIndex === '/admin/submissions' &&
        !this.$route.params.submissionId
      ) {
        this.handleRetrieveSavedFilters()
        await Promise.all([this.getAdminSubmissions()])
      }
      if (
        tabIndex === '/admin/submissions' &&
        this.$route.params.submissionId
      ) {
        await Promise.all([
          this.getAdminSubmission({ id: this.$route.params.submissionId }),
        ])
      }
      if (tabIndex === '/admin/stops') {
        this.handleRetrieveSavedFilters()
        await Promise.all([this.getAdminStops()])
      }
      if (tabIndex === '/admin/users') {
        await Promise.all([this.getAdminUsers()])
      }
      if (tabIndex === '/admin/domains') {
        if (this.displayBeatInput) {
          await Promise.all([this.getAdminBeats()])
        }
        await Promise.all([
          this.getAdminCities(),
          this.getAdminSchools(),
          this.getAdminStatutes(),
        ])
      }
      if (tabIndex === '/admin/cpra') {
        await Promise.all([this.getHistoricalCpraReports()])
      }

      this.loading = false
    },

    handleUpdateSavedFilter(val) {
      let updatedFilters
      const sessionStorageFilters = sessionStorage.getItem('ripa_saved_filters')
      if (sessionStorageFilters) {
        updatedFilters = {
          ...JSON.parse(sessionStorageFilters),
          ...val,
        }
      } else {
        updatedFilters = val
      }
      // if no filters in session storage, set new ones
      sessionStorage.setItem(
        'ripa_saved_filters',
        JSON.stringify(updatedFilters),
      )
    },

    handleRetrieveSavedFilters() {
      if (sessionStorage.getItem('ripa_saved_filters')) {
        // omit null values from the filters
        this.savedFilterState = _.omitBy(
          JSON.parse(sessionStorage.getItem('ripa_saved_filters')),
          _.isNull,
        )
      }
    },

    async handleRedoItemsPerPage(pageData) {
      this.loading = true
      if (pageData.type === 'stops') {
        await Promise.all([this.getAdminStops(pageData)])
        this.loading = false
      } else if (pageData.type === 'submission') {
        await Promise.all([this.getAdminSubmissions(pageData)])
        this.loading = false
      }
    },

    async handleSubmissionDetailItemsPerPage(pageData) {
      this.loading = true
      await Promise.all([
        this.getAdminSubmission({
          id: pageData.id,
          ...pageData,
        }),
      ])
      this.loading = false
    },

    async handleSubmissionDetailPaginate(pageData) {
      this.loading = true
      await Promise.all([
        this.getAdminSubmission({
          id: pageData.submissionId,
          ...pageData,
        }),
      ])
      this.loading = false
    },

    async handlePaginate(pageData) {
      this.loading = true
      if (pageData.type === 'stops') {
        await Promise.all([this.getAdminStops(pageData)])
      } else if (pageData.type === 'submission') {
        await Promise.all([this.getAdminSubmissions(pageData)])
      }
      this.loading = false
    },

    async handleAdminFiltering(filterData) {
      this.loading = true
      if (filterData.type === 'stops') {
        await Promise.all([this.getAdminStops(filterData)])
        this.loading = false
      } else if (filterData.type === 'submission') {
        await Promise.all([this.getAdminSubmissions(filterData)])
        this.loading = false
      }
    },

    async handleDeleteBeat(beat) {
      this.loading = true
      await Promise.all([this.deleteBeat(beat)])
      this.loading = false
    },

    async handleEditBeat(beat) {
      this.loading = true
      await Promise.all([this.editBeat(beat)])
      this.loading = false
    },

    async handleEditUser(user) {
      this.loading = true
      await Promise.all([this.editUser(user)])
      this.loading = false
    },

    async handleUploadUsers(usersFile, usersAgency) {
      this.loading = true
      const result = await Promise.all([
        this.uploadUsers({ usersFile, usersAgency }),
      ])
      this.loading = false
      this.snackbarText = result[0]
      this.snackbarVisible = true
    },

    async handleUploadDomain(domainFile) {
      this.loading = true
      const result = await Promise.all([this.uploadDomain(domainFile)])
      this.loading = false
      this.snackbarText = result[0]
      this.snackbarVisible = true
    },

    async handleCreateCpraReport(reportParameters) {
      this.loading = true
      const result = await Promise.all([
        this.createCpraReport(reportParameters),
      ])
      this.loading = false
      this.snackbarText = result[0]
      this.snackbarVisible = true
    },

    async handleDownloadCpraReport(fileName) {
      this.loading = true
      const result = await Promise.all([this.downloadCpraReport(fileName)])
      this.loading = false
      this.snackbarText = result[0]
      this.snackbarVisible = true
    },

    async handleSubmitStops(stops) {
      this.loading = true
      const submissionResults = await Promise.all([this.submitStops(stops)])
      this.loading = false
      if (!submissionResults[0].submissionId) {
        // show the error message, no redirect
        this.snackbarText = `Submission error: ${submissionResults[0]}`
        this.snackbarVisible = true
      } else {
        // if the submission goes through (meaning no message was sent back),
        // set the toast text and automatically redirect
        const notificationText =
          stops.length > 1
            ? `${stops.length} stops were submitted`
            : '1 stop was submitted'
        this.snackbarText = notificationText
        this.snackbarVisible = true
        setTimeout(() => {
          // need to push user to submission screen
          this.$router.push(
            `/admin/submissions/${submissionResults[0].submissionId}`,
          )
        }, 4000)
      }
    },

    async handleSubmitAll(filterData) {
      this.loading = true
      const submissionResults = await Promise.all([
        this.submitAllStops(filterData),
      ])
      this.loading = false
      if (!submissionResults[0].submissionId) {
        this.snackbarText = `Submission error: ${submissionResults[0]}`
        this.snackbarVisible = true
      } else {
        this.snackbarText = 'All stops were submitted'
        this.snackbarVisible = true
        // need to push user to submission screen
        setTimeout(() => {
          // need to push user to submission screen
          this.$router.push(
            `/admin/submissions/${submissionResults[0].submissionId}`,
          )
        }, 2000)
      }
    },
  },
}
</script>
