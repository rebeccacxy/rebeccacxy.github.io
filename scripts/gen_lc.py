import requests, sys
import json


def get_qn(slug):
    url = "https://leetcode.com/graphql"

    payload = json.dumps({
        "operationName":
        "questionData",
        "variables": {
            "titleSlug": f"{slug}"
        },
        "query":
        "query questionData($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    questionId\n    questionFrontendId\n        title\n    titleSlug\n    content\n    translatedTitle\n    translatedContent\n    isPaidOnly\n    difficulty\n    likes\n    dislikes\n    isLiked\n    similarQuestions\n    exampleTestcases\n    categoryTitle\n    contributors {\n      username\n      profileUrl\n      avatarUrl\n      __typename\n    }\n    topicTags {\n      name\n      slug\n      translatedName\n      __typename\n    }\n    companyTagStats\n    codeSnippets {\n      lang\n      langSlug\n      code\n      __typename\n    }\n    stats\n    hints\n    solution {\n      id\n      canSeeDetail\n      paidOnly\n      hasVideoSolution\n      paidOnlyVideo\n      __typename\n    }\n    status\n    sampleTestCase\n    metaData\n    judgerAvailable\n    judgeType\n    mysqlSchemas\n    enableRunCode\n    enableTestMode\n    enableDebugger\n    envInfo\n    libraryUrl\n    adminUrl\n    challengeQuestion {\n      id\n      date\n      incompleteChallengeCount\n      streakCount\n      type\n      __typename\n    }\n    __typename\n  }\n}\n"
    })
    headers = {
        'Content-Type': 'application/json',
    }

    response = requests.request("GET", url, headers=headers, data=payload)

    return response.json()


def create_md(question):
    f = open("scripts/lc_template.md", "r")
    md = str(f.read())
    replaces = {
        "{QUESTION_ID}": question['questionId'],
        "{TITLE}": question["title"],
        "{TITLE_SLUG}": question["titleSlug"],
        "{DIFFICULTY}": question["difficulty"],
        "{CONTENT}": question["content"],
    }
    for k in replaces:
        if replaces[k] is None:
            replaces[k] = ''
        md = md.replace(k, replaces[k])
    return md


def main():
    qn = sys.argv[1]
    response = get_qn(qn)
    md = create_md(response["data"]["question"])
    f = open(f"_leetcodes/{qn}.md", "w+")
    f.write(md)
    f.close()


if __name__ == "__main__":
    main()
