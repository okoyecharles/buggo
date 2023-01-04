import PropType from 'prop-types';

const InlineError = ({ error }) => (
  <p className="my-1 text-xs lg:text-sm text-red-600 font-subMain font-medium">
    {error}
  </p>
);

export default InlineError;

InlineError.propTypes = {
  error: PropType.string.isRequired,
};
