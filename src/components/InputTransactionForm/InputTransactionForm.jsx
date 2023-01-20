import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './InputTransactionForm.css';
import AsyncSelect from 'react-select/async';
import sprite from 'images/icons_sprite.svg';
import { Btn } from 'components/Buttons/Btn';
import {
  getTransactionCategories,
  API_TRANSACTION,
} from './api/apiTransactions';
import { addTransactionOp } from 'redux/transactions/transactionsOps';
import { DatePickerComponent } from 'components/DatePickerComponent/DatePickerComponent';
import Notiflix from 'notiflix';
import { notifySettings } from '../../utils/notifySettings';

const selectStyles = {
  control: () => ({
    boxSizing: 'border-box',
    width: '168px',
    height: '40px',
    backgroundColor: '#ffffff',
    color: '#C7CCDC',
    fontSize: '12px',
    boxShadow: 'none',
    fontWeight: '400',
    fontFamily: "Roboto,'Open Sans','Helvetica Neue', sans-serif",
    lineHeight: '1.15',
    letterSpacing: '0.02em',
    display: 'flex',
    alignItems: 'center',
    borderLeft: '2px solid #F5F6FB',
    borderRight: '2px solid #F5F6FB',
    borderTop: 'none',
    borderBottom: 'none',
    paddingLeft: '20px',
  }),
  menu: () => ({
    boxSizing: 'border-box',
    width: '182px',
    backgroundColor: '#ffffff',
    zIndex: '100',
    border: '2px solid #F5F6FB',
    boxShadow: '0px 3px 4px rgba(170, 178, 197, 0.4)',
  }),
  valueContainer: styles => ({
    ...styles,
    padding: '0',
  }),
  singleValue: styles => ({
    ...styles,
    color: '#C7CCDC',
  }),
  indicatorSeparator: () => ({
    // ...styles,
    display: 'none',
  }),
  dropdownIndicator: (styles, { isFocused, isSelected }) => ({
    ...styles,
    color: isFocused ? '#52555F' : '#C7CCDC',
    transform: isFocused ? 'rotate(180deg)' : null,
  }),
  option: (_, { isDisabled, isFocused }) => {
    return {
      height: '32px',
      paddingLeft: '20px',
      display: 'flex',
      alignItems: 'center',
      fontSize: '12px',
      boxShadow: 'none',
      fontWeight: '400',
      fontFamily: "Roboto,'Open Sans','Helvetica Neue', sans-serif",
      lineHeight: '1.15',
      letterSpacing: '0.02em',
      color: isFocused ? '#52555F' : '#C7CCDC',
      cursor: isDisabled ? 'not-allowed' : 'default',
      backgroundColor: isFocused ? '#F5F6FB' : '#ffffff',
    };
  },
};

export default function InputTransactionForm({ type = 'expense' }) {
  const TRANSACTION_FORM_DATA = {
    expense: {
      description: 'Product description',
      selectCategoryPlaceholder: 'Product category',
    },
    income: {
      description: 'Income description',
      selectCategoryPlaceholder: 'Income category',
    },
  };

  // const multiSelectStyles = {
  //   option: (defaultStyles, state) => ({
  //     ...defaultStyles,
  //     color: state.isSelected ? '#52555F' : '#C7CCDC',
  //     backgroundColor: state.isSelected ? '#a0a0a0' : '#ffffff',
  //     fontSize: '12px',
  //   }),
  //   control: defaultStyles => ({
  //     ...defaultStyles,

  //     width: '168px',
  //     height: '40px',
  //     fontSize: '12px',
  //     boxShadow: 'none',

  //     color: '#C7CCDC',
  //     border: 'none',
  //     borderLeft: '#F5F6FB 1px solid',
  //     borderRight: '#F5F6FB 1px solid',
  //   }),
  //   singleValue: defaultStyles => ({
  //     ...defaultStyles,
  //     fontSize: '12px',
  //     color: '#C7CCDC',
  //   }),
  //   placeholder: defaultStyles => ({
  //     ...defaultStyles,
  //     //  color: '#C7CCDC',
  //     fontSize: '12px',
  //   }),
  // };

  const today = new Date();
  const initialFormData = {
    product: '',
    sum: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [date, setDate] = useState(today);
  const [category, setCategory] = useState(null);

  const dispatch = useDispatch();
  //const token = useSelector(state => state.auth.accessToken);
  const token = useSelector(state => state.auth.token);

  const onClearForm = () => {
    setDate(today);
    setFormData(initialFormData);
    setCategory(null);
  };

  const isFormValid = (product, category, sum) => {
    let isValid = true;
    if (!product) {
      Notiflix.Notify.warning(
        'You should enter transaction description',
        notifySettings
      );
      isValid = false;
    }
    if (!category) {
      Notiflix.Notify.warning(
        'You should choose transaction category',
        notifySettings
      );
      isValid = false;
    }
    if (sum === '' || parseFloat(sum) < 0.01) {
      Notiflix.Notify.warning(
        'You should enter transaction amount',
        notifySettings
      );
      isValid = false;
    }
    return isValid;
  };

  const onFormSubmit = () => {
    if (!isFormValid) return null;
    const transaction = {
      description: formData.product,
      amount: parseFloat(formData.sum),
      date: date.toISOString().split('T')[0],
      category: Object.keys(API_TRANSACTION[type].apiCategories)[
        category.value
      ],
    };
    dispatch(addTransactionOp({ token, type, transaction }));
    onClearForm();
  };

  const validateSumInput = value => {
    if (value === '') {
      setFormData(oldData => {
        return { ...oldData, sum: '' };
      });
      return null;
    }

    let num = parseFloat(value);

    if (isNaN(num)) num = formData.sum;

    setFormData(oldData => {
      return { ...oldData, sum: num };
    });
  };

  const promiseOptions = () =>
    new Promise(resolve => getTransactionCategories(type, token, resolve));

  return (
    <div className="input-product-form__wrapper">
      <form
        className="input-product-form"
        style={{ display: 'flex', alignItems: 'center' }}
      >
        {/* <svg
          className="input-product-form--calendar-svg"
          width="20"
          height="20"
        >
          <use href={sprite + `#calendar`}></use>
        </svg> */}
        {/* <ReactDatePicker
          className="date-picker__input"
          selected={date}
          dateFormat="yyyy.MM.dd"
          onChange={date => setDate(date)}
          maxDate={date}
          
        /> */}
        <DatePickerComponent
          name="date"
          date={date}
          handler={date => setDate(date)}
        />

        <div className="input-product-form__inputs-wrapper">
          <input
            type="text"
            value={formData.product}
            className="input-product-form__input product-description"
            name="product"
            placeholder={TRANSACTION_FORM_DATA[type].description}
            onChange={e =>
              setFormData(oldData => {
                return { ...oldData, product: e.target.value };
              })
            }
          />
          <AsyncSelect
            key={type}
            defaultOptions
            placeholder={TRANSACTION_FORM_DATA[type].selectCategoryPlaceholder}
            styles={selectStyles}
            loadOptions={promiseOptions}
            closeMenuOnSelect={true}
            onChange={selectedOption => setCategory(selectedOption)}
            value={category}
          />
          <input
            type="text"
            value={formData.sum}
            className="input-product-form__input product-amount"
            name="product"
            placeholder="0.00"
            onChange={e => validateSumInput(e.target.value)}
            required
          />
          <svg className="input-product-form--calc-svg" width="20" height="20">
            <use href={sprite + `#calculator`}></use>
          </svg>
        </div>
        <Btn text="INPUT" onClick={onFormSubmit} />
        <Btn text="CLEAR" onClick={onClearForm} />
      </form>
    </div>
  );
}
