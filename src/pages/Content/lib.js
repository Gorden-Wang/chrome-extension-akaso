/*
 * @Author Gorden
 * @Date 2020-05-24 13:07:48
 * @LastEditors Gorden
 * @LastEditTime 2020-07-26 14:17:49
 */
import axios from 'axios';
import qs from 'qs';
const COID = 2630120;
axios.defaults.headers = { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' };
export const checkTecher = async (user) => {
  const timestamp = + new Date();
  return axios.post(
    `https://www.acadsoc.com.cn/Ajax/Web.UI.Fun.Course.aspx?method=GetTutorTime&_timestamp=${timestamp}`, qs.stringify({
      TUID: user.id,
      COID: COID,
      __: 'GetTutorTime',
    }))
}

export const getTime = async (user, TargetTime) => {
  const timestamp = + new Date();
  return await axios.post(
    `https://www.acadsoc.com.cn/Ajax/Web.UI.Fun.Course.aspx?method=GetTargetTimeAvaDuration&_timestamp=${timestamp}`,
    qs.stringify({
      TUID: user.id,
      TargetTime: `"${TargetTime}"`,
      COID: COID,
      __: 'GetTargetTimeAvaDuration'
    })
  )
  /**
   * TUID: 70481
TargetTime: 2020-05-29
COID: COID
__: GetTargetTimeAvaDuration
   */
}

export const bookTeacher = async (user, bookTime) => {
  const timestamp = + new Date();
  return await axios.post(
    `https://www.acadsoc.com.cn/Ajax/Web.UI.Fun.Course.aspx?method=AppointClass&_timestamp=${timestamp}`,
    qs.stringify({
      TUID: user.id,
      bookingWay: 3,
      COID: COID,
      UID: 6952381,
      targetTime: bookTime,
      classtool: 7,
      isNew: 0,
      teacherPers: "",
      teacherStyle: "",
      __: 'AppointClass'
    })
  )
}

async function getMyTime(date) {
  const timestamp = + new Date();
  return await axios.post(
    `https://www.acadsoc.com.cn/Ajax/Web.UI.Fun.User.aspx?method=GetStudentPreReviewLessonsByTime&_timestamp=${timestamp}`,
    qs.stringify({
      COID: COID,
      start: `"${date}"`,
      __: 'GetStudentPreReviewLessonsByTime'
    })
  )
}

async function checkTimeInPreffer(obj, preferTime = [], date) {
  let res = [];
  const { data: { value } } = await getMyTime(`${date} 00:00`);
  if ((value || []).length !== 0) return [];
  Object.keys(obj).forEach(key => {
    const { hour } = obj[key];
    preferTime.forEach(time => {
      if (hour === time) {
        res.push(`"${date} ${hour}"`);
      }
    });

  });
  return res;
}

async function hackTeacher(user, date) {

  const { data: { value } } = await getMyTime(date);
  const isBook1030 = (value || []).filter(book => {
    const {
      start,
      fullname,
    } = book;
    const time = start.split(' ')[1];
    return time === '10:30';
  });
  const isBook1130 = (value || []).filter(book => {
    const {
      start,
      fullname,
    } = book;
    const time = start.split(' ')[1];
    return time === '11:30';
  });

  if (isBook1030.length > 0 && isBook1130.length > 0) return false;
  if (isBook1030.length === 0 && user.id === '31252') {

  }

}

export const book = async (users) => {
  users.forEach(async user => {
    const { data: { value } } = await checkTecher(user);
    console.log(`${user.name}`, `GetTutorTime:`, value);
    if (user.preferTime.length !== 0) {
      const filterTime = value.filter(val => {
        const teacherTime = +new Date(`${val.time} ${user.preferTime[0]}`)
        if (!user.startDate) return true;
        return teacherTime >= + new Date(user.startDate);
      })
      console.log(`${user.name}`, `filterTime:`, filterTime);
      filterTime.forEach(async data => {
        const { isfull, time } = data;
        if (isfull === 0) {
          const { data: { value: avTime } } = await getTime(user, time);
          console.log(`${user.name}`, `getTime:`, avTime);
          const canBookTimes = await checkTimeInPreffer(avTime, user.preferTime, time);
          console.log(`${user.name}`, `canBookTimes:`, canBookTimes);
          if (canBookTimes.length > 0) {
            canBookTimes.forEach(async timestamp => {
              const bookStatus = await bookTeacher(user, timestamp);
              console.log('i want to book teacher', user.name, timestamp, timestamp, bookStatus.data.value.msg);
            })
          }
        }
      })
    }
  });
}