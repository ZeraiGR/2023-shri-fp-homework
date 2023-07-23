/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */

import Api from '../tools/api';

import {
    allPass,
    compose,
    curry,
    length,
    lt,
    gt,
    tap,
    split
} from 'ramda';

const api = new Api();

// Constants
const VALIDATION_ERROR = 'ValidationError';
const NUM_REGEXP = /[0-9.]/ig;

// Helper functions

// API
const transformNum = api.get('https://api.tech/numbers/base');
const getAnimalById = id => api.get(`https://animals.tech/${id}`, {});
const getResult = (res) => res.result;
const getFrom10to2Params = value => ({from: 10, to: 2, number: value});

// Misc
const toNumber = str => Number(str);
const splitByEmptySpace = curry(split)('');
const getNumSquare = num => num ** 2;
const getDivRemaider = num => num % 3;

// For validation
const isLt10sym = (str) => lt(str.length, 10);
const isGt2sym = (str) => gt(str.length, 2);
const isPositive = (str) => gt(toNumber(str), 0); 
const isValidStr = (str) => NUM_REGEXP.test(str);

const isValidValue = allPass([isValidStr, isLt10sym, isGt2sym, isPositive]);

const validateValue = (value) => new Promise((resolve, reject) => {
  isValidValue(value) ? resolve(value) : reject(VALIDATION_ERROR);
});

const app = (value) => Promise.resolve(value);

// step 3
const getRoundedNumFromStrAngLogResult = (logfn, value) => 
  compose(tap(logfn), Math.round, toNumber)(value);

// step 4 
const transformNumFrom10to2base = value => 
  compose(transformNum, getFrom10to2Params)(value);

const getResultFromNumTransformAPIAngLogResult = (logfn, value) => 
  compose(tap(logfn), getResult)(value);

// step 5
const getNumSymLengthAngLogResult = (logfn, value) => 
  compose(tap(logfn), length, splitByEmptySpace)(value);

// step 6
const takeNumSquareAngLogResult = (logfn, value) => 
  compose(tap(logfn), getNumSquare)(value);

// step 7
const takeDivRemaiderAngLogResult = (logfn, value) => 
  compose(tap(logfn), getDivRemaider)(value);

// step 8
const getRandomAnimalFromAPI = value => getAnimalById(value);

// Main
const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
  // bind writeLog to all step fns
  const transportValueAndWriteLog = (value) => compose(tap(writeLog))(value);
  const getRoundedNumFromStr = curry(getRoundedNumFromStrAngLogResult)(writeLog);
  const getResultFromNumTransformAPI = curry(getResultFromNumTransformAPIAngLogResult)(writeLog);
  const getNumSymLength = curry(getNumSymLengthAngLogResult)(writeLog);
  const takeNumSquare = curry(takeNumSquareAngLogResult)(writeLog);
  const takeDivRemaider = curry(takeDivRemaiderAngLogResult)(writeLog);

  // flow
  app(value)
    .then(transportValueAndWriteLog)
    .then(validateValue)
    .then(getRoundedNumFromStr)
    .then(transformNumFrom10to2base)
    .then(getResultFromNumTransformAPI)
    .then(getNumSymLength)
    .then(takeNumSquare)
    .then(takeDivRemaider)
    .then(getRandomAnimalFromAPI)
    .then(getResult)
    .then(handleSuccess)
    .catch(handleError);
}

export default processSequence;
