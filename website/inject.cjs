const fs = require('fs');
const content = fs.readFileSync('d:\\projects\\ubiqui_shield\\website\\architecture_content.html', 'utf8');
const arch = fs.readFileSync('d:\\projects\\ubiqui_shield\\website\\architecture.html', 'utf8');
const insertion = `
<section class="documentation-section reveal">
    <div class="container doc-container markdown-body">
        ${content}
    </div>
</section>
`;
const updated = arch.replace('    <footer>', insertion + '    <footer>');
fs.writeFileSync('d:\\projects\\ubiqui_shield\\website\\architecture.html', updated);
