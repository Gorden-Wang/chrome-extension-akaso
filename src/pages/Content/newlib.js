import axios from 'axios';
import qs from 'qs';
import day from 'dayjs';
const COID = 2630120;
const Today = day();
axios.defaults.headers = { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' };

const TargetTime = (new Array(8)).fill(true).map((val, index) => {
  return Today.add(index, 'days').format('YYYY/MM/DD');
});

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


function checkTimeInPreffer(obj, preferTime = [], date) {
  let res = [];
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

const bookTeacher = async (user, bookTime) => {
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

const checkTeachIsCanBookByDay = async (user, targetTime) => {
  const timestamp = + new Date();
  const res = await axios.post(
    `https://www.acadsoc.com.cn/Ajax/Web.UI.Fun.Course.aspx?method=GetTargetTimeAvaDuration&_timestamp=${timestamp}`,
    qs.stringify({
      TUID: user.id,
      TargetTime: `"${targetTime}"`,
      COID: COID,
      __: 'GetTargetTimeAvaDuration'
    })
  )
  const { data: { value: avTime } } = res;

  if (!avTime) return false;

  const canBookTime = checkTimeInPreffer(avTime, user.preferTime, targetTime)

  if (canBookTime.length > 0) {
    canBookTime.forEach(async timestamp => {
      const bookStatus = await bookTeacher(user, timestamp);
      console.log('i want to book teacher', user.name, timestamp, timestamp, bookStatus.data.value.msg);
    })
  }

}

export default function book(users) {
  users.forEach(user => {
    TargetTime.forEach(time => {
      checkTeachIsCanBookByDay(user, time)
    })
  })
}
