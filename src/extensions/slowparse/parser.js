//Index 0 returns human-readable message
//Index 1 returns start character of the error
//Index 2 returns end character of the error
//Index 3 returns the start line number
//Index 4 returns the end line number
//Index 5 returns the output of the error

define(function(require){
    function parser(input) {
        var parse = require("slowparse/slowparse");
        var result = parse.HTML(document, input);
        var msg = []; 
        var output = "";  

        if(result.error){
            var obj = result.error;
            var lineCount = 1;
            var lineBeginStart = 0;
            var lineBeginEnd = 0;
            var parsedText; 
            var charCount = 0;
            var errorJSON = {
                "ATTRIBUTE_IN_CLOSING_TAG": "<p>The closing <code>&lt;/{{ error }}&gt;</code> tag cannot contain any attributes.</p>",
                "CLOSE_TAG_FOR_VOID_ELEMENT": "<p>The closing <code>&lt;/{{ error }}&gt;</code> tag is for a void element (that is, an element that doesn't need to be closed).</p>",
                "CSS_MIXED_ACTIVECONTENT": "<p>The css property has a url() value that currently points to an insecure resource. You can make this error disappear by logging into webmaker. For more information on how modern browsers signal insecure content, visit <a href='https://developer.mozilla.org/en-US/docs/Security/MixedContent'>this link</a>.</p>",
                "EVENT_HANDLER_ATTR_NOT_ALLOWED": "<p>Sorry, but security restrictions on this site prevent you from using the JavaScript event handler attribute. If you really need to use JavaScript, consider using <a href='http://jsbin.com/'>jsbin</a> or <a href='http://jsfiddle.net/'>jsfiddle</a>.</p>",
                "HTML_CODE_IN_CSS_BLOCK": "<p>HTML code was detected in CSS context</p>",
                "HTTP_LINK_FROM_HTTPS_PAGE": "<p>The <code>&lt;{{ error }}&gt;</code> tag's <code>{{ error1 }}</code> attribute currently points to an insecure resource. You can make this error disappear by logging into webmaker. For more information on how modern browsers signal insecure content, visit <a href='https://developer.mozilla.org/en-US/docs/Security/MixedContent'>this link</a>.</p>",
                "INVALID_ATTR_NAME": "<p>The attribute has a name that is not permitted under HTML5 naming conventions.</p>",
                "UNSUPPORTED_ATTR_NAMESPACE": "<p>The attribute uses an attribute namespace that is not permitted under HTML5 conventions.</p>",
                "MULTIPLE_ATTR_NAMESPACES": "<p>The attribute has multiple namespaces. Check your text and make sure there's only a single namespace prefix for the attribute.</p>",
                "INVALID_CSS_DECLARATION": "<p>This CSS declaration never closes.</p>",
/*Left off here*/"INVALID_CSS_PROPERTY_NAME": "<p>CSS property [[result.error.cssProperty.property]] does not exist. You may want to see a <a href='https://developer.mozilla.org/en/CSS/CSS_Reference'>list of CSS properties</a>.</p>",
                "INVALID_CSS_RULE": "<p><em data-highlight='[[result.error.cssRule.start]],[[result.error.cssRule.end]]'>This</em> CSS rule is not legal CSS.</p>",
                "INVALID_TAG_NAME": "<p>The <code>&lt;</code> character <em data-highlight='[[result.error.openTag.start]],[[result.error.openTag.end]]'>here</em> appears to be the beginning of a tag, but is not followed by a valid tag name.</p> <p>If you just want a <code>&lt;</code> to appear on your Web page, try using <code>&amp;lt;</code> instead.</p> <p>Or, see a <a href='https://developer.mozilla.org/en/docs/Web/Guide/HTML/HTML5/HTML5_element_list'>list of HTML5 tags</a>.</p>",
                "JAVASCRIPT_URL_NOT_ALLOWED": "<p>Sorry, but security restrictions on this site prevent you from using the <code>javascript:</code> URL <em data-highlight='[[result.error.value.start]],[[result.error.value.end]]'>here</em>. If you really need to use JavaScript, consider using <a href='http://jsbin.com/'>jsbin</a> or <a href='http://jsfiddle.net/'>jsfiddle</a>.</p>",
                "MISMATCHED_CLOSE_TAG": "<p>The closing <code>&lt;/[[result.error.closeTag.name]]&gt;</code> tag <em data-highlight='[[result.error.closeTag.start]],[[result.error.closeTag.end]]'>here</em> doesn't pair with the opening <code>&lt;[[result.error.openTag.name]]&gt;</code> tag <em data-highlight='[[result.error.openTag.start]],[[result.error.openTag.end]]'>here</em>. This is likely due to a missing or misplaced <code>&lt;/[[result.error.openTag.name]]&gt;</code> tag.",
                "MISSING_CSS_BLOCK_CLOSER": "<p>Missing block closer or next property:value; pair following <em data-highlight='[[result.error.cssValue.start]],[[result.error.cssValue.end]]'>[[result.error.cssValue.value]]</em>.</p>",
                "MISSING_CSS_BLOCK_OPENER": "<p>Missing block opener after <em data-highlight='[[result.error.cssSelector.start]],[[result.error.cssSelector.end]]'>[[result.error.cssSelector.selector]]</em>.</p>",
                "MISSING_CSS_PROPERTY": "<p>Missing property for <em data-highlight='[[result.error.cssSelector.start]],[[result.error.cssSelector.end]]'>[[result.error.cssSelector.selector]]</em>.</p>",
                "MISSING_CSS_SELECTOR": "<p>Missing either a new CSS selector or the &lt;/style&gt; tag <em data-highlight='[[result.error.cssBlock.start]],[[result.error.cssBlock.end]]'>here</em>.</p>",
                "MISSING_CSS_VALUE": "<p>Missing value for <em data-highlight='[[result.error.cssProperty.start]],[[result.error.cssProperty.end]]'>[[result.error.cssProperty.property]]</em>.</p>",
                "SCRIPT_ELEMENT_NOT_ALLOWED": "<p>Sorry, but security restrictions on this site prevent you from using <code>&lt;script&gt;</code> tags <em data-highlight='[[result.error.openTag.start]],[[result.error.closeTag.end]]'>here</em>. If you really need to use JavaScript, consider using <a href='http://jsbin.com/'>jsbin</a> or <a href='http://jsfiddle.net/'>jsfiddle</a>.</p>",
                "SELF_CLOSING_NON_VOID_ELEMENT": "<p>The <code>&lt;[[result.error.name]]&gt;</code> tag <em data-highlight='[[result.error.start]],[[result.error.end]]'>here</em> can't be self-closed, because <code>&lt;[[result.error.name]]&gt;</code> is not a void element; it must be closed with a separate <code>&lt;/[[result.error.name]]&gt;</code> tag.</p>",
                "UNCAUGHT_CSS_PARSE_ERROR": "<p>A parse error occurred outside expected cases: <em data-highlight='[[result.error.error.start]],[[result.error.error.end]]'>[[result.error.error.msg]]</em></p>",
                "UNCLOSED_TAG": "<p>The <code>&lt;[[result.error.openTag.name]]&gt;</code> tag <em data-highlight='[[result.error.openTag.start]],[[result.error.openTag.end]]'>here</em> never closes.</p>",
                "UNEXPECTED_CLOSE_TAG": "<p>The closing <code>&lt;/[[result.error.closeTag.name]]&gt;</code> tag <em data-highlight='[[result.error.closeTag.start]],[[result.error.closeTag.end]]'>here</em> doesn't pair with anything, because there are no opening tags that need to be closed.</p>",
                "UNFINISHED_CSS_PROPERTY": "<p>Property <em data-highlight='[[result.error.cssProperty.start]],[[result.error.cssProperty.end]]'>[[result.error.cssProperty.property]]</em> still needs finalizing with :</p>",
                "UNFINISHED_CSS_SELECTOR": "<p>Selector <em data-highlight='[[result.error.cssSelector.start]],[[result.error.cssSelector.end]]'>[[result.error.cssSelector.selector]]</em> still needs finalizing with {</p>",
                "UNFINISHED_CSS_VALUE": "<p>Value <em data-highlight='[[result.error.cssValue.start]],[[result.error.cssValue.end]]'>[[result.error.cssValue.value]]</em> still needs finalizing with ;</p>",
                "UNKOWN_CSS_KEYWORD": "<p>The CSS @keyword <em data-highlight='[[result.error.cssKeyword.start]],[[result.error.cssKeyword.end]]'>[[result.error.cssKeyword.value]]</em> does not match any known @keywords.</p>",
                "UNQUOTED_ATTR_VALUE": "<p>The Attribute value <em data-highlight='[[result.error.start]]'>here</em> should start with an opening double quote.</p>",
                "UNTERMINATED_ATTR_VALUE": "<p>The <code>&lt;[[result.error.openTag.name]]&gt;</code> tag's <code>[[result.error.attribute.name.value]]</code> attribute has a value <em data-highlight='[[result.error.attribute.value.start]]'>here</em> that doesn't end with a closing double quote.</p>",
                "UNTERMINATED_CLOSE_TAG": "<p>The closing <code>&lt;/[[result.error.closeTag.name]]&gt;</code> tag <em data-highlight='[[result.error.closeTag.start]],[[result.error.closeTag.end]]'>here</em> doesn't end with a <code>&gt;</code>.</p>",
                "UNTERMINATED_COMMENT": "<p>The comment <em data-highlight='[[result.error.start]]'>here</em> doesn't end with a <code>--&gt;</code>.</p>",
                "UNTERMINATED_CSS_COMMENT": "<p>The CSS comment <em data-highlight='[[result.error.start]]'>here</em> doesn't end with a <code>*/</code>.</p>",
                "UNBOUND_ATTRIBUTE_VALUE": "<p>The attribute value <code>[[result.error.value]]</code> <em data-highlight='[[result.error.interval.start]],[[result.error.interval.end]]'>here</em> appears to be detached from an attribute. You may be missing an '=' sign.</p>",
                "UNTERMINATED_OPEN_TAG": "<p>The opening <code>&lt;[[result.error.openTag.name]]&gt;</code> tag <em data-highlight='[[result.error.openTag.start]],[[result.error.openTag.end]]'>here</em> doesn't end with a <code>&gt;</code>.</p>"
            };
            
            //human-readable msg, start, end of error based on error type
            if (obj.type === "ATTRIBUTE_IN_CLOSING_TAG"){
                msg[0] = Mustache.render(errorJSON.ATTRIBUTE_IN_CLOSING_TAG, { 'error': obj.closeTag.name });
                msg[1] = obj.closeTag.start;
                msg[2] = obj.closeTag.end;
            }
            if (obj.type === "CLOSE_TAG_FOR_VOID_ELEMENT"){
                msg[0] = Mustache.render(errorJSON.CLOSE_TAG_FOR_VOID_ELEMENT, { 'error': obj.closeTag.name });
                msg[1] = obj.closeTag.start;
                msg[2] = obj.closeTag.end;
            }
            if (obj.type === "CSS_MIXED_ACTIVECONTENT"){
                msg[0] = errorJSON.CSS_MIXED_ACTIVECONTENT;
                msg[1] = obj.cssProperty.start;
                msg[2] = obj.cssProperty.end;
            }
            if (obj.type === "EVENT_HANDLER_ATTR_NOT_ALLOWED"){
                msg[0] = errorJSON.EVENT_HANDLER_ATTR_NOT_ALLOWED;
            }
            if (obj.type === "HTML_CODE_IN_CSS_BLOCK"){
                msg[0] = errorJSON.HTML_CODE_IN_CSS_BLOCK;
                msg[1] = obj.html.start;
                msg[2] = obj.html.end;
            }
            if (obj.type === "HTTP_LINK_FROM_HTTPS_PAGE"){ 
                msg[0] = Mustache.render(errorJSON.HTTP_LINK_FROM_HTTPS_PAGE, { 'error': obj.openTag.name, 'error1': obj.attribute.name.value});
                msg[1] = obj.openTag.start;
                msg[2] = obj.openTag.end;
            }
            if (obj.type === "INVALID_ATTR_NAME"){
                msg[0] = errorJSON.INVALID_ATTR_NAME;
                msg[1] = obj.start;
                msg[2] = obj.end;
            }
            if (obj.type === "UNSUPPORTED_ATTR_NAMESPACE"){
                msg[0] = errorJSON.UNSUPPORTED_ATTR_NAMESPACE;
                msg[1] = obj.start;
                msg[2] = obj.end;
            }
            if (obj.type === "MULTIPLE_ATTR_NAMESPACES"){
                msg[0] = errorJSON.MULTIPLE_ATTR_NAMESPACES;
                msg[1] = obj.start;
                msg[2] = obj.end;
            }
            if (obj.type === "INVALID_CSS_DECLARATION"){
                msg[0] = errorJSON.INVALID_CSS_DECLARATION;
            }
            if (obj.type === "INVALID_CSS_PROPERTY_NAME"){
                msg[0] = errorJSON.INVALID_CSS_PROPERTY_NAME;
                msg[1] = obj.cssProperty.start;
                msg[2] = obj.cssProperty.end;
            }
            if (obj.type === "INVALID_CSS_RULE"){
                msg[0] = errorJSON.INVALID_CSS_RULE;
            }
            if (obj.type === "INVALID_TAG_NAME"){
                msg[0] = errorJSON.INVALID_TAG_NAME;
                msg[1] = obj.openTag.start;
                msg[2] = obj.openTag.end;
            }
            if (obj.type === "JAVASCRIPT_URL_NOT_ALLOWED"){
                msg[0] = errorJSON.JAVASCRIPT_URL_NOT_ALLOWED;
            }
            if (obj.type === "MISMATCHED_CLOSE_TAG"){
                msg[0] = errorJSON.MISMATCHED_CLOSE_TAG;
                msg[1] = obj.closeTag.start;
                msg[2] = obj.closeTag.end;
            }
            if (obj.type === "MISSING_CSS_BLOCK_CLOSER"){
                msg[0]= errorJSON.MISSING_CSS_BLOCK_CLOSER;
                msg[1] = obj.cssValue.start;
                msg[2] = obj.cssValue.end;
            }
            if (obj.type === "MISSING_CSS_BLOCK_OPENER"){
                msg[0] = errorJSON.MISSING_CSS_BLOCK_OPENER;
                msg[1] = obj.cssSelector.start;
                msg[2] = obj.cssSelector.end;
            }
            if (obj.type === "MISSING_CSS_PROPERTY"){
                msg[0] = errorJSON.MISSING_CSS_PROPERTY;
                msg[1] = obj.cssSelector.start;
                msg[2] = obj.cssSelector.end;
            }
            if (obj.type === "MISSING_CSS_SELECTOR"){
                msg[0] = errorJSON.MISSING_CSS_SELECTOR;
                msg[1] = obj.cssBlock.start;
                msg[2] = obj.cssBlock.end;
            }
            if (obj.type === "MISSING_CSS_VALUE"){
                msg[0] = errorJSON.MISSING_CSS_VALUE;
                msg[1] = obj.cssProperty.start;
                msg[2] = obj.cssProperty.end;
            }
            if (obj.type === "SCRIPT_ELEMENT_NOT_ALLOWED"){
                msg[0] = errorJSON.SCRIPT_ELEMENT_NOT_ALLOWED;
            }
            if (obj.type === "SELF_CLOSING_NON_VOID_ELEMENT"){
                msg[0] = errorJSON.SELF_CLOSING_NON_VOID_ELEMENT;
                msg[1] = obj.start;
                msg[2] = obj.end;
            }
            if (obj.type === "UNCAUGHT_CSS_PARSE_ERROR"){
                msg[0] = errorJSON.UNCAUGHT_CSS_PARSE_ERROR;
                msg[1] = obj.error.start;
                msg[2] = obj.error.end;
            }
            if (obj.type === "UNCLOSED_TAG"){
                msg[0] = errorJSON.UNCLOSED_TAG;
                msg[1] = obj.openTag.start;
                msg[2] = obj.openTag.end;
            }
            if (obj.type === "UNEXPECTED_CLOSE_TAG"){
                msg[0] = errorJSON.UNEXPECTED_CLOSE_TAG;
                msg[1] = obj.closeTag.start;
                msg[2] = obj.closeTag.end;
            }
            if (obj.type === "UNFINISHED_CSS_PROPERTY"){
                msg[0] = errorJSON.UNFINISHED_CSS_PROPERTY;
                msg[1] = obj.cssProperty.start;
                msg[2] = obj.cssProperty.end;
            }
            if (obj.type === "UNFINISHED_CSS_SELECTOR"){
                msg[0] = errorJSON.UNFINISHED_CSS_SELECTOR;
                msg[1] = obj.cssSelector.start;
                msg[2] = obj.cssSelector.end;
            }
            if (obj.type === "UNFINISHED_CSS_VALUE"){
                msg[0] = errorJSON.UNFINISHED_CSS_VALUE;
                msg[1] = obj.cssValue.start;
                msg[2] = obj.cssValue.end;
            }
            if (obj.type === "UNKOWN_CSS_KEYWORD"){
                msg[0] = errorJSON.UNKOWN_CSS_KEYWORD;
                msg[1] = obj.cssKeyword.start;
                msg[2] = obj.cssKeyword.end;
            }
            if (obj.type === "UNQUOTED_ATTR_VALUE"){
                msg[0] = errorJSON.UNQUOTED_ATTR_VALUE;
                msg[1] = obj.start;
                msg[2] = obj.start;
            }
            if (obj.type === "UNTERMINATED_ATTR_VALUE"){
                msg[0] = errorJSON.UNTERMINATED_ATTR_VALUE;
                msg[1] = obj.openTag.start;
                msg[2] = obj.openTag.end;
            }
            if (obj.type === "UNTERMINATED_CLOSE_TAG"){
                msg[0] = errorJSON.UNTERMINATED_CLOSE_TAG;
                msg[1] = obj.closeTag.start;
                msg[2] = obj.closeTag.end;
            }
            if (obj.type === "UNTERMINATED_COMMENT"){
                msg[0] = errorJSON.UNTERMINATED_COMMENT;
                msg[1] = obj.start;
                msg[2] = obj.start;
            }
            if (obj.type === "UNTERMINATED_CSS_COMMENT"){
                msg[0] = errorJSON.UNTERMINATED_CSS_COMMENT;
                msg[1] = obj.start;
                msg[2] = obj.start;
            }
            if (obj.type === "UNBOUND_ATTRIBUTE_VALUE"){
                msg[0] = errorJSON.UNBOUND_ATTRIBUTE_VALUE;
                msg[1] = obj.interval.start;
                msg[2] = obj.interval.end;
            }
            if (obj.type === "UNTERMINATED_OPEN_TAG"){
                msg[0] = errorJSON.UNTERMINATED_OPEN_TAG;
                msg[1] = obj.openTag.start;
                msg[2] = obj.openTag.end;
            }
	        for(var i = msg[1]; i <= msg[2]; i++){
	            output += input[i];
	        }
	        msg[5] = output;

            //Finds the line number for the start of the error
            for(var i = 0; i <= (msg[1] + 1); i++)
            {
                if(input[i] === "\n")
                {
                    lineCount += 1;
                    lineBeginStart = i;
                }
                parsedText += input[i];
                charCount++;
            }
            //line number for start of error
            msg[3] = lineCount;

            ////Finds the line number for the end of the error
            for(var i = (msg[1] + 1); i <= (msg[2] + 1); i++)
            {
                if(input[i] === "\n")
                {
                    lineCount += 1;
                    lineBeginEnd = i;
                }
                parsedText += input[i];
                charCount++;
            }
            //character relative to start of the row
            msg[1] = msg[1] - lineBeginStart
            msg[2] = msg[2] - lineBeginEnd;
            
            //line number for end of error
            msg[4] = lineCount;
        }
       return msg;
    }

    return parser;
});