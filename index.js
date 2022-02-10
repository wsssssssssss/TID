const axios = require("axios");
const dayjs = require("dayjs");

const githubClient = axios.create({
  baseURL: 'https://api.github.com/repos/wsssssssssss/TID',
  timeout: 5000,
  headers: { authorization: `Bearer ${process.env.TOKEN}` }
});

githubClient.interceptors.response.use(({ data }) => data, error => Promise.reject(error));

function fetchIssues() {
  return githubClient.get(`/issues`);
}

function postIssue() {
  return githubClient.post(`/issues`, {
    title: dayjs().format("YYYY_MM_DD"),
    body: `오늘 무엇을 했는지, 기능 구현하면서 어떤 문제가 있었는지를 작성합니다.
세부적인 정보도 같이 작성합니다.
@kimjuneseo, @wnsdnn, @yeongyu05, @youngjoon568, @pyjun01
<br />
ex)
- 트렐로 기능 구현
  - 카드 팝업 구현
  - 드래그앤드랍 구현
- 드래그앤드랍을 구현할떄 드랍한 곳의 idx를 제대로 가져오지 못했음
  - 해결: 친구가 도와줬는데 idx를 가져올때 Math 메소드를 ceil로 잘못사용하고 있었음`
  });
}

async function main() {
  const issues = (await fetchIssues()) || [];

  console.log(issues);
  await Promise.all(issues.map(({ number }) =>
    githubClient.patch(`/issues/${number}`, { state: 'closed' })
  ));

  return postIssue();
}

main().then(console.log);
