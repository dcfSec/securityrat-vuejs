<template>
  <md-dialog :md-active.sync="showDialog" md-closed="close()">
    <md-dialog-title>Export XLSX file</md-dialog-title>
    <form novalidate @submit.prevent="submitExport">
      <md-dialog-content class="minWidth">
        <md-checkbox v-model="exportStatus">Export with status values</md-checkbox>
      </md-dialog-content>

      <md-dialog-actions>
        <md-button class="md-primary" @click="close()">Close</md-button>
        <md-button type="submit" class="md-primary">Generate</md-button>
      </md-dialog-actions>
    </form>
  </md-dialog>
</template>

<script>
import * as Excel from "exceljs";
import saveAs from "file-saver";

export default {
  name: "ExcelExport",
  props: {
    exportData: Object
  },
  data: function () {
    return {
      exportStatus: false,
      showDialog: false
    }
  },
  methods: {
    close() {
      this.showDialog = false
      this.$emit('close-modal', true)
    },
    show() {
      this.showDialog = true
    },
    async submitExport() {
      const workbook = new Excel.Workbook();
      workbook.creator = 'SecurityRAT';
      workbook.created = new Date();
      const dataSheet = workbook.addWorksheet(this.exportData['name'], {
        headerFooter: {firstHeader: this.exportData['name']}
      });

      let validators = {}

      const validatorSheet = workbook.addWorksheet('validators');
      let validatorRowCount = 1
      this.exportData['validators'].sort((a, b) => a.showOrder - b.showOrder).forEach(function (item) {
        if (item.isEnum === true) {
          let valueRow = []
          item.values.sort((a, b) => a.showOrder - b.showOrder).forEach(function (value) {
            valueRow.push(value.name)
          });
          validators[item.id] = {
            type: 'list',
            allowBlank: true,
            formulae: ['validators!$' + validatorRowCount + ':$' + validatorRowCount + '']
          };
          validatorSheet.addRow(valueRow)
          validatorRowCount++
        }
      })
      let columns = []
      this.exportData["header"].forEach(function (item) {
        columns.push({header: item, key: item, style: {alignment: {wrapText: true}}})
      })
      dataSheet.columns = columns;
      dataSheet.getRow(1).font = {bold: true};
      dataSheet.autoFilter = {
        from: 'A1',
        to: {
          row: 1,
          column: columns.length
        }
      }

      const optionColumnsOrder = this.exportData["optionColumnsOrder"];
      const statusColumnsOrder = this.exportData["statusColumnsOrder"];
      const statusData = this.exportData["statusData"];
      const exportStatus = this.exportStatus;

      //     let needValidator = []

      this.exportData["requirements"].forEach(function (item) {
        let collectionInstancesString = ""
        item.collectionInstances.sort((a, b) => a.showOrder - b.showOrder).forEach(function (i) {
          collectionInstancesString = collectionInstancesString + i.name + "\r\n"
        });
        let row = [collectionInstancesString, item.shortName, item.description]
        optionColumnsOrder.forEach(function (i) {
          row.push(item.optionColumnContents.find(function (column) {
            return column.optionColumnId === this;
          }, i)['content'])
        })
        if (exportStatus === true) {
          statusColumnsOrder.forEach(function (i) {
            if (item['id'] in statusData && i in statusData[item['id']]) {
              row.push(statusData[item['id']][i])
            } else {
              row.push("")
            }
          })
        }
        dataSheet.addRow(row)
      })

      this.exportData["statusColumnsOrder"].forEach(function (item, index) {
        if (item in validators) {
          const validatorColumn = dataSheet.getColumn(3 + optionColumnsOrder.length + index + 1);
          validatorColumn.eachCell({includeEmpty: true}, function (cell, rowNumber) {
            if (rowNumber > 1) {
              cell.dataValidation = validators[item]
            }
          });
        }
      })


      const buffer = await workbook.xlsx.writeBuffer();
      const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const fileExtension = '.xlsx';

      const blob = new Blob([buffer], {type: fileType});

      saveAs(blob, 'test' + fileExtension);
    }
  }
}
</script>

<style scoped>

</style>