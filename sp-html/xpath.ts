// ... nut success yet

const xpeval =
  (xpath: string, document: Document) => 
    (new XPathEvaluator()).createExpression(xpath).evaluate(document);
