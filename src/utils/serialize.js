const serialize = (data) =>
  JSON.parse(
    JSON.stringify(
      data,
      (_, value) =>
        typeof value === 'bigint'
          ? Number(value)
          : value
    )
  );

module.exports = {
  serialize,
};