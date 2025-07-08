const asyncHandler = require("express-async-handler");
const docusign = require("docusign-esign");

const integratorKey = "d54d333c-3560-4611-9503-dac871864557";
const userId = "13cd3bd6-d671-4bca-a154-094901341127";
const authServer = "account-d.docusign.com";
const rsaKey = `
-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEA0h2eeKaexVH6L0qKVcONAuwYJ9l9f5LYPv/iQT/RTcqqNrap
xyFq/PkZHw7dKcxJGz6/2mkFSI2hxkA47I5od+uEY2FQiwcCzhYESGbJvpdzBObi
anJQxuDrmPwPNlEQQFakaikEECviHN/qKOMz8I/Fww2Dk6yCfxGWk3bAoUFs29d+
9SU+C1g3x5BDoGO3qqvi5NAGVvxYoQuqRnQUflZg+RSn8cQjNMvBo9lVwi6sUO/h
DywFySGdbyV5bF1oEY3Bq0Yvl4GvmcWyue0khmhdRDZz5Ktod0eduOYpf7AOw8vs
rL9E1StvcCPpxveEgePIB/Jh4pW97hPeSbDqbQIDAQABAoIBABZlXNJcZDkBE2s+
BT+9/8ZLdwmsV4GlG9KfQLUWwc8KZpk9YBxfFgHP5VsXoQBHC5XRWu7DWfJRUmiI
yOiCB2Wc33geU9D11tkzpJI5DpD3oKVpnMGe3LhOGh6s40w1WMea1JySMaIto0TT
oyhni049bOVtB9TSQvibXdLrCf5GAws7zqzeg+ygVBV8K2csgxlXW1ZOtPmlZt2g
3cQq5Dh17hYGVlaIP3R53RRdkwd0hB1UeRmoiNr59BZC45HFWOGgfs5sfRcy018G
KkHDotR5FJtFmVDGHWKPlXBujQ66SOMoyhbxBG+JaS8xoa+dOsazCJEZQ4ca/Qmy
mma/vaECgYEA64yh9KzQBH9P/jJlPscnuLpm+9GlKJ9qNyLCKs9WvOjwprJYsVS1
wU+j97kvQCeGAlR513KAh6z89nuf+u74cH+odA0t0YmYzWJB7gqEeGIV6WlkwyBi
WmaTFSHzBwVLvh60zsqwIeQjgLKp7Wdo/HaK3IWWq1gu0tlxFdvsJh0CgYEA5Fux
aVkzt+bfIrQIvUzlf4VoOWD317ZY/0grNnZpm/3Dc5XSbuUVWIq3aFpgz9hHmdlC
Ev0oS20fWrLW/FS4Cn/L5AVuDGD+BtCSLcF2LGwB73i+SFOUOyv0IpAY2F3w49dK
afRXnHGdIlX0Ww+dGk50okhxfslX3opXitR8ZJECgYEAtkX7RbU8u14xbolc43mF
eWN1McSHQ6oorUXObwZHHqQ7JSO5km/0vgR848N/lut+verU5i2K3HK2xZ3grHOj
+Jowpq1UGWOaxMQWNLgaznVIc3jFKmGy+jWJ975vq60jcZmdXLBoH7HE72BSMo3l
JggtaHxPnYP9p9fvtHSchtkCgYBz792lx8ULNCrLWq4pNbY6xQeCQinymcCbcw+F
ah76NJ8butAIv0PUHTE6yM/oFj1b7cKvE1p22OMXUD74AychJXrlvJ//puqxmQju
NA+ERB3DcADjhZN3azxao+AJUcBwXKiKHKSyZ7hIa21RIh838OckUTVWEnELKh+B
+5lgEQKBgDyoT5FyYes4OQ2t1o32Nvr5kYlzE/BOv0CauamYc/+e76G2cZ1O0eFw
D7s2Xp0I5sYxhVcRcVYroUkG1jqqYbx1DnGnuK9X/izeyYN4t2lM8ZmKxfwK5FHy
Xtwol6kuauSWUW/wIJEom8+GozTbWhcVwrCIxgB50UNSU4m/BpSq
-----END RSA PRIVATE KEY-----
`;


const apiClient = new docusign.ApiClient();
apiClient.setOAuthBasePath(authServer);
apiClient.setBasePath("https://demo.docusign.net/restapi");

// ✅ Express route handler format using asyncHandler
const getJWTToken = async () => {
  const scopes = ["signature", "impersonation"];
  const result = await apiClient.requestJWTUserToken(
    integratorKey,
    userId,
    scopes,
    rsaKey,
    3600
  );

  const accessToken = result.body.access_token;
  const userInfo = await apiClient.getUserInfo(accessToken);
  const accountId = userInfo.accounts[0].accountId;

  apiClient.addDefaultHeader("Authorization", `Bearer ${accessToken}`);

  return { accessToken, accountId, basePath: "https://demo.docusign.net/restapi" };
};

module.exports = {
  getJWTToken,
  apiClient,
};

