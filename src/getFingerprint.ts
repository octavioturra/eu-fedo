import Fingerprint2 from "fingerprintjs2";

export default async function getFingerprint(): Promise<string> {
  return new Promise(resolve => {
    Fingerprint2.get({}, function(components: Array<any>) {
      var values = components.map(function(component) {
        return component.value;
      });
      var murmur = Fingerprint2.x64hash128(values.join(""), 31);
      resolve(murmur);
    });
  });
}
