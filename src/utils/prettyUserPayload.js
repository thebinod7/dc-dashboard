const prettyUserPayload = (payload) => {
  let obj = {};
  let _profile = payload.profile;
  if (_profile) {
    if (_profile.gender) obj.gender = _profile.gender;
    if (_profile.avatar) obj.avatar = _profile.avatar;
    if (_profile.designation) obj.designation = _profile.designation;
    if (_profile.city) obj.city = _profile.city;
    if (_profile.country) obj.country = _profile.country;
    if (_profile.bio) obj.bio = _profile.bio;
    if (_profile.social && _profile.social.length) {
      for (let i of _profile.social) {
        obj[i.name] = i.fullUrl;
      }
    }
  }
  return obj;
};

module.exports = prettyUserPayload;
