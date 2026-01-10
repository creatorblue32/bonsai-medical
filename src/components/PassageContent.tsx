interface PassageContentProps {
  content: string;
}

function isTableBlock(text: string): boolean {
  const lines = text.trim().split('\n');
  return lines.length > 1 && lines.every(line => line.includes('|'));
}

function renderTable(text: string) {
  const lines = text.trim().split('\n');
  
  // First line is header
  const headerCells = lines[0].split('|').map(cell => cell.trim()).filter(cell => cell);
  
  // Remaining lines are data rows
  const dataRows = lines.slice(1).map(line => 
    line.split('|').map(cell => cell.trim()).filter(cell => cell)
  );
  
  return (
    <div className="passage-table">
      <table>
        <thead>
          <tr>
            {headerCells.map((cell, i) => (
              <th key={i}>{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dataRows.map((row, rowIdx) => (
            <tr key={rowIdx}>
              {row.map((cell, cellIdx) => (
                <td key={cellIdx}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PassageContent({ content }: PassageContentProps) {
  const blocks = content.split('\n\n');
  
  return (
    <div className="passage-content">
      {blocks.map((block, i) => {
        if (isTableBlock(block)) {
          return <div key={i}>{renderTable(block)}</div>;
        } else if (block.trim().startsWith('Table') || block.trim().startsWith('Figure')) {
          // Table/Figure caption
          return <p key={i} className="passage-caption"><strong>{block}</strong></p>;
        } else {
          return <p key={i}>{block}</p>;
        }
      })}
    </div>
  );
}

