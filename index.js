// import axios from 'axios';
const axios = require('axios');

const getApiData = async() => {

    const data = await axios.get('https://interview.adpeai.com/api/v2/get-task')
    
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;

    const lastYearTransactions = data.data.transactions.filter(transaction => {
      const transactionDate = new Date(transaction.timeStamp);
      return transactionDate.getFullYear() === lastYear;
    });

    const empId = {};
    lastYearTransactions.forEach((transaction)=> {
      if(transaction.type==='alpha'){
      if(empId[transaction.employee.id]){
        empId[transaction.employee.id].amount.push(transaction.amount);
        empId[transaction.employee.id].transaction.push(transaction.transactionID);
      }else {
        empId[transaction.employee.id] = {
          amount: [transaction.amount],
          transaction: [transaction.transactionID],
        }
      }
      }
    })
    

    let max = 0;
    let finalData;
    for(let key in empId){
      let data = empId[key].amount.reduce((acc, value)=> { return {sum: (acc.sum+value), empId : key, transaction: empId[key].transaction}} ,{sum: 0});
      if(max < data.sum){
        max = data.sum;
        finalData = data;
      }
    }

    axios.post('https://interview.adpeai.com/api/v2/submit-task', {id: data.data.id, result: finalData.transaction})
    .then(response => {
        console.log('Success:', response.data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
 }

 getApiData();