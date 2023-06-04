'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2023-05-30T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2023-06-01T07:41:53.286Z',
  ],
  currency: 'EUR',
  locale: 'en-GB',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-07-26T17:01:17.194Z',
    '2020-07-28T23:36:17.929Z',
    '2020-08-01T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const accounts = [account1, account2, account3, account4];

//////////////////////////////////////////////

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.total-balance');
const labelIn = document.querySelector('.summary-in');
const labelOut = document.querySelector('.summary-out');
const labelInterest = document.querySelector('.summary-interest');
const labelTimer = document.querySelector('.timer');

const inputLoginUsername = document.querySelector('.login-input--user');
const inputLoginPIN = document.querySelector('.login-input--pin');
const inputTransferTo = document.querySelector('.input-transfer--to');
const inputTransferAmount = document.querySelector('.input-transfer--amount');
const inputLoanAmount = document.querySelector('.input-loan--amount');
const inputCloseUsername = document.querySelector('.input-close--username');
const inputClosePin = document.querySelector('.input-close--pin');

const btnLogin = document.querySelector('.login-btn');
const btnTransfer = document.querySelector('.btn-transfer');
const btnLoan = document.querySelector('.btn-loan');
const btnClose = document.querySelector('.btn-close');
const btnSort = document.querySelector('.btn-sort');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

///////////////////////////////////////////////////////

// User name
const createUsernames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

// Format Dates
const formatDate = (date, locale) => {
  const calcDaysPassed = (date1, date2) => {
    return Math.round(Math.abs((date2 - date1) / (1000 * 60 * 60 * 24)));
  };
  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} Days Ago`;
  else {
    // const day = date.getDate().toString().padStart(2, '0');
    // const month = (date.getMonth() + 1).toString().padStart(2, '0');
    // const year = date.getFullYear();
    // return `${day}/${month}/${year}`;

    return new Intl.DateTimeFormat(locale).format(date);
  }
};

// Format currency
const formatCur = (acc, bal) => {
  return new Intl.NumberFormat(acc.locale, {
    style: 'currency',
    currency: acc.currency,
  }).format(bal);
};

// movements
const displayMovements = function (acc, doSort = false) {
  containerMovements.innerHTML = '';

  const movs = doSort
    ? [...acc.movements].sort((a, b) => a - b)
    : acc.movements;
  movs.forEach((mov, i) => {
    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatDate(date, acc.locale);

    const formattedMov = formatCur(acc, mov);

    const type = mov > 0 ? 'Deposit' : 'Withdrawl';
    const htmlText = `
    <div class="movements-row">
     <div class="movements-type movements-type--${type.toLowerCase()}">${
      i + 1
    } ${type}</div>
     <div class="movements-date">${displayDate}</div>
     <div class="movements-value">${formattedMov}</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', htmlText);
  });
};

// Total Balance
const computeTotalBal = function (acc) {
  acc.balance = acc.movements.reduce((sum, mov) => {
    return sum + mov;
  }, 0);
  labelBalance.textContent = `${formatCur(acc, acc.balance)}`;
};

// Summary
const summary = function (acc) {
  const totalIn = acc.movements
    .filter(mov => mov > 0)
    .reduce((sum, mov) => sum + mov, 0);

  const totalOut = acc.movements
    .filter(mov => mov < 0)
    .reduce((sum, mov) => sum + mov, 0);

  const totalInterest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((sum, mov) => sum + mov, 0);

  labelIn.textContent = `${formatCur(acc, totalIn)}`;
  labelOut.textContent = `${formatCur(acc, Math.abs(totalOut))}`;
  labelInterest.textContent = `${formatCur(acc, totalInterest)}`;
};

// Update Info
const updateInfo = function (acc) {
  displayMovements(acc);
  computeTotalBal(acc);
  summary(acc);
};

const startLogoutTimer = function () {
  let time = 120;

  const logout = function () {
    const min = Math.trunc(time / 60)
      .toString()
      .padStart(2, '0');
    const sec = (time % 60).toString().padStart(2, '0');
    labelTimer.textContent = `${min}:${sec}`;
    time--;
    if (time < 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Login to get Started';
      containerApp.style.opacity = '0';
    }
  };
  logout();
  const timer = setInterval(logout, 1000);
  return timer;
};

// Event Handlers
let currentAccount, timer;

// Login button
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  const username = inputLoginUsername.value;
  const searchedAcc = accounts.find(acc => acc.username === username);
  if (searchedAcc !== undefined) {
    currentAccount = searchedAcc;
  } else {
    inputLoginUsername.value = '';
    inputLoginPIN.value = '';
    inputLoginPIN.blur();
    // inputLoginUsername.setAttribute('placeholder', 'invalid');
    // return;
  }
  const pin = Number(inputLoginPIN.value);
  if (currentAccount?.pin === pin) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    inputLoginUsername.value = '';
    inputLoginPIN.value = '';
    inputLoginPIN.blur();

    // Current date and time
    /*
    const today = new Date();
    const day = today.getDate().toString().padStart(2, '0');
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const year = today.getFullYear();
    const hours = today.getHours().toString().padStart(2, '0');
    const min = today.getMinutes().toString().padStart(2, '0');
    labelDate.textContent = `${day}/${month}/${year}, ${hours}:${min}`;
    */
    const today = new Date();
    const options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    };
    const date = new Intl.DateTimeFormat(currentAccount.locale, options).format(
      today
    );
    labelDate.textContent = `${date}`;

    if (timer) clearInterval(timer);
    timer = startLogoutTimer();

    containerApp.style.opacity = '1';
    updateInfo(currentAccount);
  }
});

// Transfer button
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const receiverAccount = accounts.find(
    acc => inputTransferTo.value === acc.username
  );
  const transferAmount = Number(inputTransferAmount.value);

  if (
    currentAccount.balance >= transferAmount &&
    transferAmount > 0 &&
    currentAccount !== receiverAccount
  ) {
    currentAccount.movements.push(-transferAmount);
    receiverAccount.movements.push(transferAmount);

    // pushing new Date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movementsDates.push(new Date().toISOString());

    updateInfo(currentAccount);

    clearInterval(timer);
    timer = startLogoutTimer();

    inputTransferTo.value = '';
    inputTransferAmount.value = '';
    inputTransferAmount.blur();
  }
});

// Close button
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const closeUser = inputCloseUsername.value;
  const closePin = Number(inputClosePin.value);
  if (
    currentAccount.username === closeUser &&
    currentAccount.pin === closePin
  ) {
    const curIndex = accounts.findIndex(acc => acc === currentAccount);
    accounts.splice(curIndex, 1);

    labelWelcome.textContent = `Account deleted Successfully, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = '0';

    inputCloseUsername.value = '';
    inputClosePin.value = '';
    inputClosePin.blur();
  }
});

// Loan btn
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  const loan = currentAccount.movements.some(deposit => deposit >= amount / 10);
  if (loan && amount > 0) {
    setTimeout(function () {
      currentAccount.movements.push(amount);

      // pushing new Date
      currentAccount.movementsDates.push(new Date().toISOString());

      updateInfo(currentAccount);

      clearInterval(timer);
      timer = startLogoutTimer();
    }, 2500);

    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  }
});

// sort btn
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
