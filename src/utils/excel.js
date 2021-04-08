export function tableToEexcell(headers, body, filename = "res.xls") {
  //列标题
  let str = `<tr>${headers.map(v => `<th>${v}</th>`).join("")}</tr>`;
  //循环遍历，每行加入tr标签，每个单元格加td标签
  for (const row of body) {
    str += "<tr>";
    for (const cell of row) {
      //增加\t为了不让表格显示科学计数法或者其他格式
      str += `<td>${cell + "\t"}</td>`;
    }
    str += "</tr>";
  }

  //Worksheet名
  const worksheet = "sheet1";
  const uri = "data:application/vnd.ms-excel;base64,";

  //下载的表格模板数据
  const template =
    '<html xmlns:o="urn:schemas-microsoft-com:office:office" \n' +
    '      xmlns:x="urn:schemas-microsoft-com:office:excel" \n' +
    '      xmlns="http://www.w3.org/TR/REC-html40">\n' +
    "      <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>\n" +
    `        <x:Name>${worksheet}</x:Name>\n` +
    "        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>\n" +
    "        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->\n" +
    `        </head><body><table>${str}</table></body></html>\n`;
  //下载模板
  const tempA = document.createElement("a");
  tempA.href = uri + base64(template);
  tempA.download = filename;
  document.body.appendChild(tempA);
  tempA.click();
  document.body.removeChild(tempA);
}

function base64(s) {
  return window.btoa(unescape(encodeURIComponent(s)));
}
