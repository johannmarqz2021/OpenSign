/**
 *
 * @param {Parse} Parse
 */
exports.up = async (Parse) => {
  // TODO: set className here
  const className = 'contracts_Certificate';
  const schema = new Parse.Schema(className);
  schema
  .addPointer('UserId', '_User')
  .addString('FileURL')
  .addDate('ExpirationDate')
  .addString('Password')
await schema.save(null, { useMasterKey: true });
};

/**
 *
 * @param {Parse} Parse
 */
exports.down = async (Parse) => {
  // TODO: set className here
  const className = 'contracts_Certificate';
  const schema = new Parse.Schema(className);

  return schema.purge().then(() => schema.delete());
};
