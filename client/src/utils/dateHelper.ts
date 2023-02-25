import moment from 'moment';

type Format = 'calendar time' | 'on calendar' | 'from now' | 'L' | 'short calendar';
interface Options {
  format: Format;
}

const getDate = (date: string | undefined, options: Options = {
  format: 'calendar time',
}) => {
  if (!date) return '';
  const dateMoment = moment(date);
  const now = moment().startOf('day');

  if (options.format === 'from now')
    return dateMoment.fromNow();
  if (options.format === 'L')
    return dateMoment.format('L');
  if (options.format === 'short calendar') {
    if (dateMoment.days() <= 28)
      return dateMoment.fromNow();
    return dateMoment.format('[on] MMM D, YYYY');
  }

  if (now.diff(dateMoment, 'days') < 1) {
    return dateMoment.calendar();
  } else if (options.format === 'calendar time') {
    return dateMoment.format("MM/DD/YYYY HH:mm A");
  } else {
    return dateMoment.format("[on] MMMM D, YYYY");
  }
};

export default getDate;
