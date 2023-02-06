import moment from 'moment';

type Format = 'calendar time' | 'on calendar' | 'from now' | 'L';
interface Options {
  format: Format;
}

const getDate = (date: string | undefined, options: Options = {
  format: 'calendar time',
}) => {
  if (!date) return '';

  const dateMoment = moment(date);

  if (options.format === 'from now') 
    return dateMoment.fromNow();
  if (options.format === 'L')
    return dateMoment.format('L');

  if (dateMoment.days() < 2) {
    return dateMoment.calendar();
  } else if (options.format === 'calendar time') {
    return dateMoment.format("MM/DD/YYYY HH:mm A");
  } else {
    return dateMoment.format("[on] MMMM D, YYYY");
  }
};

export default getDate;
