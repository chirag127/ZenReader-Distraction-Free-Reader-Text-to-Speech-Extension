---
name: Bug Report
about: Please report bugs here to help us improve.
title: "[Bug] "
labels: bug
assignees: ""

body:
  - type: markdown
    attributes:
      value: |+
        ## Bug Report
        Please provide a clear and concise description of the bug.
        
        **Repository:** [ZenRead-AI-Reader-And-TTS-Browser-Extension](https://github.com/chirag127/ZenRead-AI-Reader-And-TTS-Browser-Extension)

  - type: input
    id: environment
    attributes:
      label: Environment
      description: What browser and version are you using?
      placeholder: "e.g., Chrome 126.0.6478.127, Firefox 128.0"
    validations:
      required: true

  - type: input
    id: reproduction-steps
    attributes:
      label: Steps to Reproduce
      description: Provide detailed steps to reproduce the bug.
      placeholder: "1. Open the extension\n2. Click on 'Summarize'\n3. Observe the error..."
    validations:
      required: true

  - type: textarea
    id: behavior
    attributes:
      label: Expected Behavior
      description: What did you expect to happen?
      placeholder: "I expected the article to be summarized."
    validations:
      required: true

  - type: textarea
    id: actual-behavior
    attributes:
      label: Actual Behavior
      description: What actually happened?
      placeholder: "An error message appeared and the summary was not generated."
    validations:
      required: true

  - type: textarea
    id: additional-context
    attributes:
      label: Additional Context
      description: Provide any other context about the problem, such as screenshots or logs.
      placeholder: "(Optional) Paste any relevant screenshots or error logs here."
    validations:
      required: false

  - type: markdown
    attributes:
      value: |+
        --- 
        _This bug report template is managed by the Apex Technical Authority, enforcing high standards for issue reporting._
        _For more information on reporting standards, see [CONTRIBUTING.md](https://github.com/chirag127/ZenRead-AI-Reader-And-TTS-Browser-Extension/blob/main/.github/CONTRIBUTING.md)._
