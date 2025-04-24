export const getCoordinateAddress = async (lng: number, lat: number) => {
  const geocoder = new kakao.maps.services.Geocoder();
  return new Promise<string>((resolve, reject) => {
    geocoder.coord2Address(lng, lat, function (result, status) {
      if (status === kakao.maps.services.Status.OK) {
        const addressObject = result[0].address || result[0].road_address;
        const address =
          addressObject.region_1depth_name +
          ' ' +
          addressObject.region_2depth_name +
          ' ' +
          addressObject.region_3depth_name;
        console.log(addressObject);
        resolve(address);
      } else {
        reject(new Error('Failed to fetch address'));
      }
    });
  });
};
