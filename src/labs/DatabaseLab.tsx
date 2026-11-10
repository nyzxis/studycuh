'use client';

import { useState, useMemo } from 'react';
import { IconLab, IconCheck } from '@/components/Icons';

interface KenariProduct {
  readonly productId: string;
  readonly productName: string;
  readonly category: string;
  readonly city: string;
  readonly unitPrice: number;
  readonly unitsInStock: number;
  readonly supplierEmail: string | null;
}

const KENARI_MART_ROWS: readonly KenariProduct[] = [
  { productId: 'P001', productName: 'Seri Kaya Spread', category: 'Bakery', city: 'Kuala Lumpur', unitPrice: 8.5, unitsInStock: 42, supplierEmail: 'sales@serikaya.my' },
  { productId: 'P002', productName: 'Sabah Tea Leaves', category: 'Beverages', city: 'Kota Kinabalu', unitPrice: 14.0, unitsInStock: 65, supplierEmail: 'info@sabahtea.my' },
  { productId: 'P003', productName: 'Sarawak Black Pepper', category: 'Spices', city: 'Kuching', unitPrice: 22.0, unitsInStock: 18, supplierEmail: null },
  { productId: 'P004', productName: 'Soya Bean Drink', category: 'Beverages', city: 'Petaling Jaya', unitPrice: 3.5, unitsInStock: 120, supplierEmail: 'orders@soyamy.com' },
  { productId: 'P005', productName: 'Butter Croissant Pack', category: 'Bakery', city: 'Kuala Lumpur', unitPrice: 11.0, unitsInStock: 9, supplierEmail: null },
];

type QueryPreset = 'all' | 'likeS' | 'inCat' | 'isNull' | 'lowStock' | 'andOr';

export function DatabaseLab() {
  const [preset, setPreset] = useState<QueryPreset>('all');
  const [normStage, setNormStage] = useState<'1nf' | '2nf' | '3nf'>('3nf');

  const { filteredRows, criteriaSyntax, explanation } = useMemo(() => {
    switch (preset) {
      case 'likeS':
        return {
          filteredRows: KENARI_MART_ROWS.filter((r) => r.productName.startsWith('S')),
          criteriaSyntax: 'Field: ProductName | Criteria: Like "S*"',
          explanation: 'Topic 7 Wildcard Rule: Asterisk (*) matches any sequence of characters at the end of "S".',
        };
      case 'inCat':
        return {
          filteredRows: KENARI_MART_ROWS.filter((r) => ['Bakery', 'Spices'].includes(r.category)),
          criteriaSyntax: 'Field: Category | Criteria: In ("Bakery", "Spices")',
          explanation: 'Topic 7 In() Operator: Matches records whose Category equals any value in the list.',
        };
      case 'isNull':
        return {
          filteredRows: KENARI_MART_ROWS.filter((r) => r.supplierEmail === null),
          criteriaSyntax: 'Field: SupplierEmail | Criteria: Is Null',
          explanation: 'Topic 7 Null Check: Returns rows where SupplierEmail is empty/missing (never use = Null).',
        };
      case 'lowStock':
        return {
          filteredRows: KENARI_MART_ROWS.filter((r) => r.unitsInStock < 25),
          criteriaSyntax: 'Field: UnitsInStock | Criteria: < 25',
          explanation: 'Topic 7 Comparison Operator: Filters inventory items needing urgent restocking.',
        };
      case 'andOr':
        return {
          filteredRows: KENARI_MART_ROWS.filter(
            (r) => r.category === 'Beverages' && r.unitPrice >= 10
          ),
          criteriaSyntax: 'Same Criteria Row (AND): Category = "Beverages" AND UnitPrice >= 10',
          explanation: 'Topic 7 Design Grid Rule: Conditions placed on the SAME Criteria row are combined with logical AND.',
        };
      default:
        return {
          filteredRows: KENARI_MART_ROWS,
          criteriaSyntax: 'SELECT *, [UnitPrice]*[UnitsInStock] AS StockValue FROM Products;',
          explanation: 'Showing all 5 sample KenariMart.accdb records with Calculated Field StockValue.',
        };
    }
  }, [preset]);

  return (
    <div className="bento-card" data-testid="database-lab">
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          marginBottom: '16px',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '14px',
        }}
      >
        <div>
          <span className="pastel-badge pastel-green" style={{ marginBottom: '6px' }}>
            <IconLab size={13} /> ITIF0023 Interactive Lab
          </span>
          <h3 style={{ margin: 0, fontSize: '1.2rem' }}>
            MS Access Query Criteria Sandbox (KenariMart.accdb) &amp; Normalization Inspector
          </h3>
        </div>
      </div>

      {/* Part 1: Query Criteria Sandbox */}
      <div style={{ marginBottom: '22px' }}>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
          <button type="button" className={`btn-secondary ${preset === 'all' ? 'active' : ''}`} onClick={() => setPreset('all')}>
            All Records + Calculated Field
          </button>
          <button type="button" className={`btn-secondary ${preset === 'likeS' ? 'active' : ''}`} onClick={() => setPreset('likeS')} data-testid="db-preset-likes">
            Like &quot;S*&quot; (Wildcard)
          </button>
          <button type="button" className={`btn-secondary ${preset === 'inCat' ? 'active' : ''}`} onClick={() => setPreset('inCat')}>
            In (&quot;Bakery&quot;, &quot;Spices&quot;)
          </button>
          <button type="button" className={`btn-secondary ${preset === 'isNull' ? 'active' : ''}`} onClick={() => setPreset('isNull')}>
            Is Null (Missing Email)
          </button>
          <button type="button" className={`btn-secondary ${preset === 'andOr' ? 'active' : ''}`} onClick={() => setPreset('andOr')}>
            Same-Row AND Criteria
          </button>
        </div>

        <div
          style={{
            padding: '10px 14px',
            backgroundColor: 'var(--pastel-green-bg)',
            border: '1px solid var(--pastel-green-border)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '12px',
            fontSize: '0.84rem',
          }}
        >
          <div className="tabular-mono" style={{ fontWeight: 700, color: 'var(--ink-primary)' }}>
            {criteriaSyntax}
          </div>
          <div style={{ color: 'var(--pastel-green-text)', marginTop: '2px' }}>{explanation}</div>
        </div>

        <div className="editorial-table-wrap">
          <table className="editorial-table" data-testid="db-query-table">
            <thead>
              <tr>
                <th>ProductID (PK)</th>
                <th>ProductName</th>
                <th>Category</th>
                <th>City</th>
                <th>UnitPrice (RM)</th>
                <th>UnitsInStock</th>
                <th>StockValue: [UnitPrice]*[UnitsInStock]</th>
                <th>SupplierEmail</th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.productId}>
                  <td><strong>{row.productId}</strong></td>
                  <td>{row.productName}</td>
                  <td>{row.category}</td>
                  <td>{row.city}</td>
                  <td>{row.unitPrice.toFixed(2)}</td>
                  <td>{row.unitsInStock}</td>
                  <td><strong>RM {(row.unitPrice * row.unitsInStock).toFixed(2)}</strong></td>
                  <td>
                    {row.supplierEmail ?? (
                      <span className="pastel-badge pastel-amber">Null</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Part 2: 1NF -> 2NF -> 3NF Inspector */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
          <h4 style={{ margin: 0, fontSize: '1rem' }}>Normalization (1NF → 2NF → 3NF) &amp; Keys Inspector</h4>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className={`btn-secondary ${normStage === '1nf' ? 'active' : ''}`} onClick={() => setNormStage('1nf')}>
              1NF (Atomic Cells)
            </button>
            <button type="button" className={`btn-secondary ${normStage === '2nf' ? 'active' : ''}`} onClick={() => setNormStage('2nf')}>
              2NF (No Partial Dep.)
            </button>
            <button type="button" className={`btn-secondary ${normStage === '3nf' ? 'active' : ''}`} onClick={() => setNormStage('3nf')}>
              3NF (No Transitive Dep.)
            </button>
          </div>
        </div>

        <div
          style={{
            padding: '12px 16px',
            backgroundColor: 'var(--canvas-bg)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.86rem',
          }}
        >
          {normStage === '1nf' && (
            <div>
              <strong>First Normal Form (1NF):</strong> Eliminate repeating groups and ensure every attribute holds a single atomic value. Composite Primary Key: <code>(OrderID, ProductID)</code>.
            </div>
          )}
          {normStage === '2nf' && (
            <div>
              <strong>Second Normal Form (2NF):</strong> Must be in 1NF + remove <em>Partial Dependencies</em> (non-key attributes like <code>ProductName</code> that depend only on part of a composite key <code>ProductID</code> are split into a separate <code>Products</code> table).
            </div>
          )}
          {normStage === '3nf' && (
            <div>
              <IconCheck size={14} /> <strong>Third Normal Form (3NF):</strong> Must be in 2NF + remove <em>Transitive Dependencies</em> (non-key attributes depending on another non-key attribute, such as <code>SupplierID -&gt; SupplierPhone</code>, are separated into <code>Suppliers(SupplierID PK, SupplierPhone)</code>).
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
