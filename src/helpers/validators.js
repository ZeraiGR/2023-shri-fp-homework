/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */

import {
    __,
    allPass,
    includes,
    compose,
    curry,
    equals,
    filter,
    gte,
    anyPass,
    length,
    values,
    propEq,
    where,
    keys,
    prop,
    countBy,
    apply,
    omit,
    all,
    not
} from 'ramda';

// Colors
const isGreen = equals('green');
const isRed = equals('red');
const isOrange = equals('orange');
const isBlue = equals('blue');
const isAnyColor = includes(__, ['white', 'green', 'red', 'orange', 'blue']);


// Square
const isWhiteSquare = propEq('square', 'white');
const isGreenSquare = propEq('square', 'green');

const isNotWhiteSquare = compose(not, isWhiteSquare);

const getSquareColor = curry(prop)('square');


// Star
const isWhiteStar = propEq('star', 'white');
const isRedStar = propEq('star', 'red');

const isNotWhiteStar = compose(not, isWhiteStar);
const isNotRedStar = compose(not, isRedStar);


// Triangle
const isWhiteTriangle = propEq('triangle', 'white');
const isGreenTriangle = propEq('triangle', 'green');

const isNotWhiteTriangle = compose(not, isWhiteTriangle);

const getTriangleColor = curry(prop)('triangle');


// Circle
const isWhiteCircle = propEq('circle', 'white');


// Rest
const gte2 = curry(gte)(__, 2);
const eq1 = curry(equals)(1);
const eq2 = curry(equals)(2);
const eq3 = curry(equals)(3);
const eq4 = curry(equals)(4);
const getMax = curry(apply)(Math.max);
const omitWhite = curry(omit)(['white']);
const allIsOrange = curry(all)(isOrange);
const allIsGreen = curry(all)(isGreen);

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = (shape) => {
    return allPass([
      isRedStar, 
      isGreenSquare, 
      isWhiteCircle, 
      isWhiteTriangle
    ])(shape);
};

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = (shape) => {
  return compose(
    gte2, 
    length, 
    filter(isGreen), 
    values)(shape);
};

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = (shape) => {
  const numRedFigures = compose(length, filter(isRed), values)(shape);
  const numBlueFigures = compose(length, filter(isBlue), values)(shape);

  return equals(numBlueFigures, numRedFigures);
};

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = where({
  circle: isBlue,
  star: isRed,
  square: isOrange,
  triangle: isAnyColor,
});

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = (shape) => {
  // colorCounts example: {red: 1, white: 3}
  const colorCounts = countBy(prop(__, shape), keys(shape));

  const hasFourSameColorElems = compose(eq4, getMax, values);
  
  const hasThreeSameColorlElemsOmitWhite = compose(
    eq3, 
    getMax, 
    values, 
    omitWhite
  );

  return anyPass([
    hasFourSameColorElems,
    hasThreeSameColorlElemsOmitWhite
  ])(colorCounts);
};

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = (shape) => {
  const hasTwoGreenFigures = compose(eq2, length, filter(isGreen), values);
  const hasOneRedFigure = compose(eq1, length, filter(isRed), values);

  return allPass([
    isGreenTriangle,
    hasTwoGreenFigures,
    hasOneRedFigure
  ])(shape);
};

// 7. Все фигуры оранжевые.
export const validateFieldN7 = (shape) => {
  return compose(allIsOrange, values)(shape);
};

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = (shape) => {
  return allPass([
    isNotWhiteStar,
    isNotRedStar
  ])(shape);
};

// 9. Все фигуры зеленые.
export const validateFieldN9 = (shape) => {
  return compose(allIsGreen, values)(shape);
};

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = (shape) => {
  const triangleAndSquareHasEqualsColors = (shape) => {
    return equals(getTriangleColor(shape), getSquareColor(shape));
  };

  return allPass([
    triangleAndSquareHasEqualsColors,
    isNotWhiteTriangle,
    isNotWhiteSquare
  ])(shape);
};
