import { PageHeader } from '../../shared/components';
import { ProductCard } from './ProductCard';
import { SegmentoSelector } from './SegmentoSelector';
import { useProducts } from './useProducts';
import { useSegmento } from './useSegmento';

export function CatalogPage() {
  const { segmento, setSegmento } = useSegmento();
  const { products, loading, error } = useProducts();

  return (
    <section>
      <PageHeader
        title="Catalogo"
        subtitle="Camaras, cercos perimetrales, kits y planes ADT"
      />

      <SegmentoSelector segmento={segmento} onChange={setSegmento} />

      {loading ? <p>Cargando productos...</p> : null}
      {error ? <p role="alert">{error}</p> : null}
      {!loading && !error && products.length === 0 ? <p>Todavia no hay productos cargados.</p> : null}

      <div className="catalog-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
