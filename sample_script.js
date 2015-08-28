function main() {
  var date = getCurrentDate();
  var titles = ["Campaign", "Clicks", "Impressions", "Conversions", "Cost","Cost/conversion"];
  var last_30_days = runReport("LAST_30_DAYS","CAMPAIGN_PERFORMANCE_REPORT");
  var last_30_days_total = runReport("LAST_30_DAYS","ACCOUNT_PERFORMANCE_REPORT");
  last_30_days_total[0][0] = 'Total';
  last_30_days.push(last_30_days_total[0]);
  var last_30_days_html = arrayToTable(last_30_days, titles, "Campaign Stats for Last 30 Days");
  var content = last_30_days_html;
  
  mail("marketing@adnabu.com", "AdWords Campaign Stats as on " + date, content);
}

function getCurrentDate(){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd<10) {
    dd='0'+dd
  } 

  if(mm<10) {
    mm='0'+mm
  } 

  today = dd+'/'+mm+'/'+yyyy;
  
  return today;
}

function runReport(time_range,report_type) {
  if(report_type == "CAMPAIGN_PERFORMANCE_REPORT"){
    var select_name = "CampaignName"
    var report = AdWordsApp.report(
      'SELECT CampaignName, Clicks, Impressions, ConvertedClicks, Cost, CostPerConvertedClick ' +
      'FROM ' + report_type + 
      ' WHERE  Impressions > 0 AND Clicks > 0 AND CampaignStatus = ENABLED '+
      'DURING ' + time_range + ' '
    );
  }
  if(report_type == "ACCOUNT_PERFORMANCE_REPORT") {
    var select_name = "AccountDescriptiveName"
    var report = AdWordsApp.report(
      'SELECT AccountDescriptiveName, Clicks, Impressions, ConvertedClicks, Cost, CostPerConvertedClick ' +
      'FROM ' + report_type + 
      ' WHERE  Impressions > 0 AND Clicks > 0 '+
      'DURING ' + time_range + ' '
    );
  }

  var rows = report.rows();
  var report = []
  while (rows.hasNext()) {
    var row = rows.next();
    var campaignName = row[select_name];
    var clicks = row['Clicks'];
    var impressions = row['Impressions'];
    var cost = row['Cost'];
    var conversions = row['ConvertedClicks'];
    var costperConversion = row['CostPerConvertedClick'];
    report.push([campaignName, clicks, impressions, conversions, cost, costperConversion]);
  }
  Logger.log(report);
  return report;
}

function mail(to, subject, content){
  MailApp.sendEmail({
    to: to,
    subject: subject,
    htmlBody: content,
  });
}

function arrayToTable(report_array, titles, heading){
  var html_table = "<h2>" + heading + "</h2>";
  
  html_table += "<table border='1'><tr>";
  
  for (var i=0; i<titles.length; i++){
    html_table += "<th>" + titles[i] + "</th>";
  }
  
  html_table += "</tr>";
  
  for (var j=0; j<report_array.length; j++){
    html_table += "<tr>";
    
    for (var k=0; k<report_array[j].length; k++){
      html_table += "<td>" + report_array[j][k] + "</td>";
    }
    
    html_table += "</tr>";
  }
  
  html_table += "</table>";
  Logger.log(html_table);
  return html_table;
}

function sum_array(report_array){
  
  var result = ["Total"];
  
  for (var k=1; k<report_array[0].length; k++){
    result[k] = 0.0;
  }
  
  for (var j=0; j<report_array.length; j++){
    for (var k=1; k<report_array[j].length; k++){
      result[k] += (+(report_array[j][k]).replace(',', ''));
    }
  }
  for (var k=1; k<report_array[0].length; k++){
    result[k] = Math.round(result[k]);
  }
  
  Logger.log(result);
  return result;
  
}
