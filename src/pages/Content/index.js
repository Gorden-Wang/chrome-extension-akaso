import React, { useState, useCallback, useEffect } from 'react';
import { render } from 'react-dom';
import { Button, Table } from 'antd';
import useInterval from './useInterval';
import {
  checkTecher,
  book
} from './lib';
import './content.styles';

const popupDom = document.createElement('div')
popupDom.id = 'xx_wrap';
document.body.appendChild(popupDom);
const popup = document.querySelector('#xx_wrap');

const users = [
  // {
  //   id: '31252',
  //   name: 'Annie.T',
  //   preferTime: [/*'10:30', */'11:30', /** '11:00', '12:00', '10:00'**/]
  // },
  // {
  //   id: '83439',
  //   name: 'aby',
  //   preferTime: ['10:30', '11:00', '11:30', '12:00', '10:00']
  // }, {
  //   id: '26693',
  //   name: 'Donie',
  //   preferTime: ['10:30', '11:00', '11:30', '12:00', '10:00']
  // },
  {
    id: '89151',
    name: 'enzo',
    preferTime: ['10:30',/*'11:00',*/ '11:30',/* '12:00', '10:00'*/],
    startDate: '2020-06-29 00:00:00'
  }
]
const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '是否可约',
    dataIndex: 'isFull',
    key: 'isFull',
    render: text => text.length === 0 ? '不可约' : '可约'
  },
  // {
  //   title: 'book',
  //   dataIndex: 'bookForYou',
  //   key: 'bookForYou',
  //   render: text => text.length === 0 ? '不可约' : '可约'
  // }
]
const MainContent = () => {
  const [uiHide, setUiHide] = useState(false)
  const popClassName = uiHide ? 'xx_popup hide_mode' : 'xx_popup';
  const popContent = uiHide ? 'hide' : 'show';
  const [isLoading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [loadRemote, setLoadRemote] = useState(false);


  const autoRefres = async () => {
    setLoadRemote(true);
  }

  const refreshHandler = useCallback(async () => {
    if (!loadRemote) return;
    setLoading(true);
    const ps = users.map(async user => {
      return Promise.resolve(checkTecher(user))
    });
    const res = await Promise.all(ps);
    setLoading(false);
    const source = res.map((item, index) => {
      const {
        data,
      } = item;
      const {
        value
      } = data;
      return {
        key: index,
        ...users[index],
        isFull: value.filter(v => v.isfull === 0)
      }
    });
    console.log(source);
    book(users);
    setDataSource(source);
  }, [loadRemote]);

  useInterval(refreshHandler, 5000, loadRemote);
  useEffect(() => {

  }, [dataSource]);

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
          onClick={autoRefres}
        >自动刷课</Button>
      </div>
      <Table
        loading={isLoading}
        pagination={false}
        columns={columns}
        dataSource={dataSource}>
      </Table>
    </div>
  )
}

render(<MainContent />, popup);