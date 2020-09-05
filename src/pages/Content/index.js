import React, { useState, useCallback, useEffect } from 'react';
import { render } from 'react-dom';
import { Button } from 'antd';
// import useInterval from './useInterval';
import book from './newlib';
import './content.styles';

const popupDom = document.createElement('div')
popupDom.id = 'xx_wrap';
document.body.appendChild(popupDom);
const popup = document.querySelector('#xx_wrap');

const users = [
  // {
  //   id: '31252',
  //   name: 'Annie.T',
  //   preferTime: [/*'10:30',*/ '11:30', /** '11:00', '12:00', '10:00'**/],
  //   startDate: '2020-07-06 00:00:00'
  // },
  {
    id: '153433',
    name: 'WK.Gerlie.ZS',
    preferTime: [/*'10:30',*/ '18:30', /** '11:00', '12:00', '10:00'**/],
    startDate: '2020-07-06 00:00:00'
  },
  // {
  //   id: '83439',
  //   name: 'aby',
  //   preferTime: ['10:30', '11:00', '11:30', '12:00', '10:00']
  // }, {
  //   id: '26693',
  //   name: 'Donie',
  //   preferTime: ['10:30', '11:00', '11:30', '12:00', '10:00']
  // },
  // {
  //   id: '89151',
  //   name: 'enzo',
  //   preferTime: [/*'10:30','11:00',*/ '12:30', '12:00',/* '10:00'*/],
  //   startDate: '2020-07-06 00:00:00'
  // }
]

const MainContent = () => {
  const [uiHide, setUiHide] = useState(false)
  const popClassName = uiHide ? 'xx_popup hide_mode' : 'xx_popup';
  const popContent = uiHide ? 'hide' : 'show';

  const bookTeacher = () => {
    setInterval(() => {
      book(users)
    }, 5000);
  }
  return (
    <div className={popClassName}>
      <div
        className="close"
        onClick={() => setUiHide(!uiHide)}>
        {popContent}
      </div>
      <div className="h1_title">
        自助刷课
      </div>
      <div className="auto_refresh">
        <Button
          type='primary'
          className="auto_button"
          onClick={bookTeacher}
        >自动刷课</Button>
      </div>
    </div>
  )
}

render(<MainContent />, popup);