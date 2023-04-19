import pdf2html from 'pdf2html';
import fs from 'fs';

const convert = async (pdfPath, htmlPath) => {
  const html = await pdf2html.html(pdfPath);
  console.log(typeof html);

  // const title = "TRANSACTION POSTING";
  // const indexOfTitle = html.indexOf(title);
  // console.log("indexOfTitle: ", indexOfTitle);
  // const end = "TOTAL ACCOUNT BALANCE";
  // const html2 = html.substring(html.indexOf(title), html.indexOf(end) + end.length); 

  const title = "Date Description Withdrawals ($) Deposits ($) Balance ($)";
  const indexOfTitle = html.indexOf(title);
  console.log("indexOfTitle: ", indexOfTitle);
  // const end = "TOTAL ACCOUNT BALANCE";
  // const html2 = html.substring(html.indexOf(title), html.indexOf(end) + end.length); 
  const html2 = html.substring(html.indexOf(title)); 

  fs.writeFile(htmlPath, html2, err => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('File written successfully');
  });
}

// convert('MasterCard%20Statement-0242%202023-04-13.pdf', 'test.html');
// convert('Chequing%20Statement-9350%202023-03-15.pdf', 'chequing.html');


// import fs from 'fs';
import cheerio from 'cheerio';
import { createObjectCsvWriter as createCsvWriter} from 'csv-writer';
// const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Read the HTML file
// const html = fs.readFileSync('test.html', 'utf8');
const html = fs.readFileSync('test.html', 'utf8');

// Parse the HTML using cheerio
const $ = cheerio.load(html);

// Extract the transactions
const transactions = [];
for(let i = 0; i < $('p').length; i++) {
  const text = $($('p')[i]).text().trim();
  // console.log(text);
  const match = text.match(/^[a-zA-Z]{3} \d{2}/);
  if (match) {
    // console.log(match[0]);
    const date = match[0];
    const regex = /^[A-Z]{3}\s\d{2}\s[A-Z]{3}\s\d{2}\s(.*)$/;
    const item = text.match(regex);
    // console.log();
    // console.log(item);
    if(!Array.isArray(item)) { // it's a credit card payment
      // console.log(text);
      const amount = $($('p')[i+1]).text().trim();
      // console.log("credit card payment: " + date + ", " + amount);
      const description = "credit card payment";
      console.log(date + ", " + amount + ", " + description);
      transactions.push({ date, description, amount });
    } else {
      const description = item[1];
      const amount = $($('p')[i+2]).text().trim();
      console.log(date + ", " + amount + ", " + description);
      transactions.push({ date, description, amount });
    }
  }
}

// $('p').each((i, elem) => {
//   const text = $(elem).text();
  
//   // console.log(text);
//   const match = text.match(/^[a-zA-Z]{3} \d{2}/);
//   if (match) {
//     console.log(match[0]);
//     // let n = 2;
//     // while(n > 0) {

//     // }
//     // const [_, dateFrom, dateTo, description, location, amount] = match;
//     // transactions.push({ dateFrom, dateTo, description, location, amount });
//   }
// });

console.log(transactions);

// Write the transactions to a CSV file
const csvWriter = createCsvWriter({
  path: 'transactions.csv',
  header: [
    { id: 'date', title: 'Date' },
    { id: 'description', title: 'Description' },
    // { id: 'location', title: 'Location' },
    { id: 'amount', title: 'Amount' },
  ],
});
csvWriter.writeRecords(transactions).then(() => {
  console.log('CSV file written successfully');
});

