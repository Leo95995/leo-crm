import { LocalStorageUtils } from "../../Utils/localstorage";

interface extraDatas {
  [key: string]: any;
}

const addExtraHeaders = (baseHeaders: any, extraHeaderList: extraDatas) => {
  for (let x = 0; x < extraHeaderList?.length; x++) {
    if (extraHeaderList) {
      const customKey = Object.keys(extraHeaderList[x])[0];
      const customValue = Object.values(extraHeaderList[x])[0];
      baseHeaders[customKey] = customValue;
    }
  }
  return baseHeaders;
};

export const getStandardHeaders = (extraHeaders?: extraDatas) => {
  const token = LocalStorageUtils.extractToken();

  let standardHeaders: any = {
    "Content-Type": "application/json",
    authorization: `Bearer ${token}`,
  };

  let headersToRet: any = standardHeaders;
  if (extraHeaders && extraHeaders?.length) {
    headersToRet = addExtraHeaders(standardHeaders, extraHeaders);
  }

  return headersToRet;
};
