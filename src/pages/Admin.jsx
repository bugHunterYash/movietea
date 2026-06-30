import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Coffee, 
  ShoppingBag, 
  Tag, 
  Users, 
  Settings as SettingsIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ArrowUp, 
  ArrowDown, 
  Mail, 
  Truck,
  Sparkles,
  Info
} from 'lucide-react';
import { getProducts, saveProducts } from '../utils/db';


// Mock initial orders
const INITIAL_ORDERS = [
  { id: 'MOV-8910', customerName: 'Aishwarya R.', phone: '9876543210', products: 'Rose Atelier x2', amount: 445, paymentStatus: 'Paid', verificationStatus: 'Pending', orderStatus: 'Placed', date: '2026-06-23' },
  { id: 'MOV-8911', customerName: 'Kabir S.', phone: '9123456780', products: 'Cacao Reserve x1, Vanilla Orchid x1', amount: 365, paymentStatus: 'Paid', verificationStatus: 'Approved', orderStatus: 'Shipped', date: '2026-06-22' },
  { id: 'MOV-8912', customerName: 'Meera G.', phone: '8877665544', products: 'Toasted Butterscotch x3', amount: 664, paymentStatus: 'Unpaid', verificationStatus: 'Rejected', orderStatus: 'Cancelled', date: '2026-06-21' }
];

// Mock initial promo codes
const INITIAL_PROMOS = [
  { id: 1, code: 'TEA50', originalPrice: 349, discountedPrice: 299, validity: '2026-12-31', active: true },
  { id: 2, code: 'WELCOME100', originalPrice: 1899, discountedPrice: 1799, validity: '2026-08-15', active: true }
];

export default function Admin() {
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    document.title = "Operations Admin | MOVITEA";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Internal Operations Admin Panel for MOVITEA brand management, order verification, and promo code desks.");
    }
  }, []);
  
  // States
  const [products, setProducts] = useState(() => getProducts());
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [promos, setPromos] = useState(INITIAL_PROMOS);

  // Modal / Form States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', slug: '', basePrice: 0, sellingPrice: 0, stock: 0, orderNumber: 0, category: '10 Sachets', flavour: '', type: 'flavour', image: '', active: true, featured: false, desc: '', shortDesc: ''
  });

  const [selectedPromo, setSelectedPromo] = useState(null);
  const [promoForm, setPromoForm] = useState({
    code: '', originalPrice: 0, discountedPrice: 0, validity: '', active: true
  });

  // Determine current active subsection based on path
  const path = location.pathname;
  const currentTab = path.includes('/products') 
    ? 'products' 
    : path.includes('/orders') 
    ? 'orders' 
    : path.includes('/promos') 
    ? 'promos' 
    : 'dashboard';

  // --- PRODUCT CRUD ---
  const handleProductSubmit = (e) => {
    e.preventDefault();
    let updatedProducts;
    if (selectedProduct) {
      // Update
      updatedProducts = products.map(p => p.id === selectedProduct.id ? { ...p, ...productForm } : p);
      setProducts(updatedProducts);
      setSelectedProduct(null);
    } else {
      // Add
      const newProduct = {
        id: `prod_${Date.now()}`,
        ...productForm
      };
      updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
    }
    saveProducts(updatedProducts);
    
    // reset form
    setProductForm({
      name: '', slug: '', basePrice: 0, sellingPrice: 0, stock: 0, orderNumber: updatedProducts.length + 1, category: '10 Sachets', flavour: '', type: 'flavour', image: '', active: true, featured: false, desc: '', shortDesc: ''
    });
  };

  const editProduct = (prod) => {
    setSelectedProduct(prod);
    setProductForm({ ...prod });
  };

  const deleteProduct = (id) => {
    if (confirm('Delete this product?')) {
      const updatedProducts = products.filter(p => p.id !== id);
      setProducts(updatedProducts);
      saveProducts(updatedProducts);
    }
  };

  // Reordering products
  const moveProduct = (index, direction) => {
    const updated = [...products].sort((a, b) => a.orderNumber - b.orderNumber);
    if (direction === 'up' && index > 0) {
      const temp = updated[index].orderNumber;
      updated[index].orderNumber = updated[index - 1].orderNumber;
      updated[index - 1].orderNumber = temp;
    } else if (direction === 'down' && index < updated.length - 1) {
      const temp = updated[index].orderNumber;
      updated[index].orderNumber = updated[index + 1].orderNumber;
      updated[index + 1].orderNumber = temp;
    }
    const finalProducts = updated.sort((a, b) => a.orderNumber - b.orderNumber);
    setProducts(finalProducts);
    saveProducts(finalProducts);
  };

  // --- ORDER HANDLERS ---
  const updateOrderVerification = (orderId, status) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        if (status === 'Approved') {
          alert('Order Confirmation Email Will Be Sent to the customer.');
        }
        return { ...o, verificationStatus: status };
      }
      return o;
    }));
  };

  const updateOrderStatus = (orderId, status) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, orderStatus: status } : o));
  };

  // --- PROMO CRUD ---
  const handlePromoSubmit = (e) => {
    e.preventDefault();
    if (selectedPromo) {
      setPromos(promos.map(p => p.id === selectedPromo.id ? { ...p, ...promoForm } : p));
      setSelectedPromo(null);
    } else {
      const newPromo = {
        id: Date.now(),
        ...promoForm
      };
      setPromos([...promos, newPromo]);
    }
    setPromoForm({ code: '', originalPrice: 0, discountedPrice: 0, validity: '', active: true });
  };

  const editPromo = (promo) => {
    setSelectedPromo(promo);
    setPromoForm({ ...promo });
  };

  const deletePromo = (id) => {
    if (confirm('Delete this promo code?')) {
      setPromos(promos.filter(p => p.id !== id));
    }
  };

  // Render sub sections
  const renderContent = () => {
    switch (currentTab) {
      case 'products':
        return (
          <div style={styles.sectionContainer}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Product Management</h2>
              <span style={styles.sectionSubtitle}>Add and arrange the sensory blends</span>
            </div>

            <div style={styles.adminGrid}>
              {/* Product Form */}
              <form onSubmit={handleProductSubmit} style={styles.adminCard}>
                <h3 style={styles.cardHeader}>{selectedProduct ? 'Update Product Details' : 'Add New Product'}</h3>
                
                <div style={styles.formGrid}>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Product Name</label>
                    <input 
                      type="text" required style={styles.input} 
                      value={productForm.name} 
                      onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                      placeholder="e.g. Lavender Rose"
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Slug</label>
                    <input 
                      type="text" required style={styles.input} 
                      value={productForm.slug} 
                      onChange={(e) => setProductForm({ ...productForm, slug: e.target.value })}
                      placeholder="e.g. lavender-rose"
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Base Price / MRP (₹)</label>
                    <input 
                      type="number" required style={styles.input} 
                      value={productForm.basePrice} 
                      onChange={(e) => setProductForm({ ...productForm, basePrice: parseInt(e.target.value) })}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Selling Price (₹)</label>
                    <input 
                      type="number" style={styles.input} 
                      value={productForm.sellingPrice} 
                      onChange={(e) => setProductForm({ ...productForm, sellingPrice: parseInt(e.target.value) })}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Stock Quantity</label>
                    <input 
                      type="number" required style={styles.input} 
                      value={productForm.stock} 
                      onChange={(e) => setProductForm({ ...productForm, stock: parseInt(e.target.value) })}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Order Placement Number</label>
                    <input 
                      type="number" required style={styles.input} 
                      value={productForm.orderNumber} 
                      onChange={(e) => setProductForm({ ...productForm, orderNumber: parseInt(e.target.value) })}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Category</label>
                    <select 
                      style={styles.select} 
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    >
                      <option value="10 Sachets">10 Sachets</option>
                      <option value="100gm Packs">100gm Packs</option>
                      <option value="Premium Jars">Premium Jars</option>
                    </select>
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Flavour (e.g. Chocolate, Vanilla)</label>
                    <input 
                      type="text" style={styles.input} 
                      value={productForm.flavour}
                      onChange={(e) => setProductForm({ ...productForm, flavour: e.target.value })}
                      placeholder="e.g. Rose / Mixed"
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Type (flavour/combo)</label>
                    <select 
                      style={styles.select} 
                      value={productForm.type}
                      onChange={(e) => setProductForm({ ...productForm, type: e.target.value })}
                    >
                      <option value="flavour">Flavour</option>
                      <option value="combo">Combo</option>
                    </select>
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Image Path</label>
                    <input 
                      type="text" style={styles.input} 
                      value={productForm.image}
                      onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                      placeholder="/images/New folder/choclate jar.png"
                    />
                  </div>
                  
                  <div style={styles.inputGroupFull}>
                    <label style={styles.label}>Short Description</label>
                    <input 
                      type="text" style={styles.input} 
                      value={productForm.shortDesc} 
                      onChange={(e) => setProductForm({ ...productForm, shortDesc: e.target.value })}
                      placeholder="Sensory micro-description"
                    />
                  </div>

                  <div style={styles.inputGroupFull}>
                    <label style={styles.label}>Detailed Description</label>
                    <textarea 
                      style={styles.textarea} 
                      value={productForm.desc} 
                      onChange={(e) => setProductForm({ ...productForm, desc: e.target.value })}
                      placeholder="Detailed tasting notes and ingredient composition..."
                    />
                  </div>

                  <div style={styles.checkboxRow}>
                    <label style={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={productForm.featured}
                        onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                      />
                      <span>Featured Product</span>
                    </label>
                    <label style={styles.checkboxLabel}>
                      <input 
                        type="checkbox" 
                        checked={productForm.active}
                        onChange={(e) => setProductForm({ ...productForm, active: e.target.checked })}
                      />
                      <span>Active / Published</span>
                    </label>
                  </div>
                </div>

                <div style={styles.formFooter}>
                  {selectedProduct && (
                    <button type="button" onClick={() => {
                      setSelectedProduct(null);
                      setProductForm({ name: '', slug: '', basePrice: 0, sellingPrice: 0, stock: 0, orderNumber: products.length + 1, category: '10 Sachets', flavour: '', type: 'flavour', image: '', active: true, featured: false, desc: '', shortDesc: '' });
                    }} style={styles.cancelBtn}>Cancel</button>
                  )}
                  <button type="submit" style={styles.submitBtn}>{selectedProduct ? 'Update Product' : 'Add Product'}</button>
                </div>
              </form>

              {/* Product List & Ordering */}
              <div style={styles.adminCard}>
                <h3 style={styles.cardHeader}>Atelier Products list</h3>
                <div style={styles.productList}>
                  {products.sort((a,b) => a.orderNumber - b.orderNumber).map((prod, index) => (
                    <div key={prod.id} style={styles.productRow}>
                      <div style={styles.productRowLeft}>
                        <div style={styles.reorderButtons}>
                          <button onClick={() => moveProduct(index, 'up')} disabled={index === 0} style={styles.orderBtn}>
                            <ArrowUp size={14} />
                          </button>
                          <button onClick={() => moveProduct(index, 'down')} disabled={index === products.length - 1} style={styles.orderBtn}>
                            <ArrowDown size={14} />
                          </button>
                        </div>
                        <div>
                          <h4 style={styles.productTitle}>{prod.name}</h4>
                          <span style={styles.productSub}>Order Pos: {prod.orderNumber} &bull; Price: ₹{prod.sellingPrice}</span>
                        </div>
                      </div>
                      
                      <div style={styles.productRowActions}>
                        <button onClick={() => editProduct(prod)} style={styles.actionBtnEdit} aria-label="Edit">
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => deleteProduct(prod.id)} style={styles.actionBtnDelete} aria-label="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'orders':
        return (
          <div style={styles.sectionContainer}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Order Verification Panel</h2>
              <span style={styles.sectionSubtitle}>Approve manual UPI receipts & track status</span>
            </div>

            <div style={styles.adminCardFull}>
              <h3 style={styles.cardHeader}>Recent Customer Transactions</h3>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Order ID</th>
                      <th style={styles.th}>Customer</th>
                      <th style={styles.th}>Products</th>
                      <th style={styles.th}>Amount</th>
                      <th style={styles.th}>Verification</th>
                      <th style={styles.th}>Order Status</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} style={styles.tr}>
                        <td style={styles.td}><strong>{order.id}</strong><div style={{fontSize: '0.75rem', opacity: 0.6}}>{order.date}</div></td>
                        <td style={styles.td}>{order.customerName}<div style={{fontSize: '0.75rem', opacity: 0.6}}>{order.phone}</div></td>
                        <td style={styles.td}>{order.products}</td>
                        <td style={styles.td}><strong>₹{order.amount}</strong></td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.badge,
                            backgroundColor: order.verificationStatus === 'Approved' ? '#D4EDDA' : order.verificationStatus === 'Rejected' ? '#F8D7DA' : '#FFF3CD',
                            color: order.verificationStatus === 'Approved' ? '#155724' : order.verificationStatus === 'Rejected' ? '#721C24' : '#856404'
                          }}>
                            {order.verificationStatus}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <select 
                            value={order.orderStatus} 
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                            style={styles.tableSelect}
                          >
                            <option value="Placed">Placed</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.tableActionRow}>
                            <button 
                              onClick={() => updateOrderVerification(order.id, 'Approved')} 
                              disabled={order.verificationStatus === 'Approved'}
                              style={styles.btnApprove} 
                              title="Approve Transaction"
                            >
                              <Check size={14} /> Approve
                            </button>
                            <button 
                              onClick={() => updateOrderVerification(order.id, 'Rejected')} 
                              disabled={order.verificationStatus === 'Rejected'}
                              style={styles.btnReject} 
                              title="Reject Transaction"
                            >
                              <X size={14} /> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'promos':
        return (
          <div style={styles.sectionContainer}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Promo Code Desk</h2>
              <span style={styles.sectionSubtitle}>Manage pricing codes and discounts</span>
            </div>

            <div style={styles.adminGrid}>
              {/* Promo Creator */}
              <form onSubmit={handlePromoSubmit} style={styles.promoFormCard}>
                <h3 style={{ ...styles.cardHeader, color: '#2B1A12' }}>{selectedPromo ? 'Modify Discount Code' : 'Create Promo Code'}</h3>
                
                <div style={styles.formGrid}>
                  <div style={styles.inputGroupFull}>
                    <label style={styles.label}>Promo Code Name</label>
                    <input 
                      type="text" required style={styles.inputPromo} 
                      value={promoForm.code} 
                      onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. FESTIVE15"
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Standard Price (₹)</label>
                    <input 
                      type="number" required style={styles.inputPromo} 
                      value={promoForm.originalPrice} 
                      onChange={(e) => setPromoForm({ ...promoForm, originalPrice: parseInt(e.target.value) })}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Discounted Price (₹)</label>
                    <input 
                      type="number" required style={styles.inputPromo} 
                      value={promoForm.discountedPrice} 
                      onChange={(e) => setPromoForm({ ...promoForm, discountedPrice: parseInt(e.target.value) })}
                    />
                  </div>
                  <div style={styles.inputGroupFull}>
                    <label style={styles.label}>Validity Date</label>
                    <input 
                      type="date" required style={styles.inputPromo} 
                      value={promoForm.validity} 
                      onChange={(e) => setPromoForm({ ...promoForm, validity: e.target.value })}
                    />
                  </div>
                  
                  <label style={styles.checkboxLabel}>
                    <input 
                      type="checkbox" 
                      checked={promoForm.active}
                      onChange={(e) => setPromoForm({ ...promoForm, active: e.target.checked })}
                    />
                    <span style={{ color: '#2B1A12' }}>Code is active</span>
                  </label>
                </div>

                <div style={styles.formFooter}>
                  {selectedPromo && (
                    <button type="button" onClick={() => {
                      setSelectedPromo(null);
                      setPromoForm({ code: '', originalPrice: 0, discountedPrice: 0, validity: '', active: true });
                    }} style={styles.cancelBtn}>Cancel</button>
                  )}
                  <button type="submit" style={styles.submitPromoBtn}>{selectedPromo ? 'Update Code' : 'Generate Code'}</button>
                </div>
              </form>

              {/* Promo List */}
              <div style={styles.promoListCard}>
                <h3 style={{ ...styles.cardHeader, color: '#2B1A12' }}>Active Promotional Codes</h3>
                <div style={styles.productList}>
                  {promos.map(promo => (
                    <div key={promo.id} style={styles.promoItemRow}>
                      <div>
                        <h4 style={{ ...styles.productTitle, color: '#2B1A12' }}>{promo.code}</h4>
                        <p style={{ fontSize: '0.8rem', color: '#5c4b37', margin: 0 }}>
                          Original: ₹{promo.originalPrice} &bull; Discount: ₹{promo.discountedPrice}
                        </p>
                        <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Valid until: {promo.validity}</span>
                      </div>
                      
                      <div style={styles.productRowActions}>
                        <button onClick={() => editPromo(promo)} style={styles.actionBtnEdit} aria-label="Edit">
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => deletePromo(promo.id)} style={styles.actionBtnDelete} aria-label="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'dashboard':
      default:
        return (
          <div style={styles.sectionContainer}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Performance Overview</h2>
              <span style={styles.sectionSubtitle}>MOVITEA Brand operations stats</span>
            </div>

            {/* Statistics Cards */}
            <div style={styles.statsGrid}>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Total Revenue</span>
                <span style={styles.statVal}>₹86,450</span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Total Orders</span>
                <span style={styles.statVal}>28</span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Pending Verification</span>
                <span style={{ ...styles.statVal, color: 'var(--primary-color)' }}>6</span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Completed Shipments</span>
                <span style={styles.statVal}>21</span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Active Blends Listed</span>
                <span style={styles.statVal}>{products.length}</span>
              </div>
            </div>

            {/* Main Dashboard Layout (Graph + Orders) */}
            <div style={styles.dashboardLayout}>
              
              {/* Graphic Chart Placeholder */}
              <div style={styles.adminCard}>
                <h3 style={styles.cardHeader}>Revenue History</h3>
                <div style={styles.chartArea}>
                  {/* Clean SVG Line chart representation */}
                  <svg viewBox="0 0 500 200" style={{ width: '100%', height: '100%' }}>
                    <path
                      d="M 20 180 L 100 140 L 180 160 L 260 90 L 340 120 L 420 50 L 480 30"
                      fill="none"
                      stroke="var(--primary-color)"
                      strokeWidth="3"
                    />
                    <circle cx="20" cy="180" r="4" fill="var(--primary-color)" />
                    <circle cx="100" cy="140" r="4" fill="var(--primary-color)" />
                    <circle cx="180" cy="160" r="4" fill="var(--primary-color)" />
                    <circle cx="260" cy="90" r="4" fill="var(--primary-color)" />
                    <circle cx="340" cy="120" r="4" fill="var(--primary-color)" />
                    <circle cx="420" cy="50" r="4" fill="var(--primary-color)" />
                    <circle cx="480" cy="30" r="4" fill="var(--primary-color)" />
                    
                    {/* Grid lines */}
                    <line x1="20" y1="180" x2="480" y2="180" stroke="rgba(43,26,18,0.08)" />
                    <line x1="20" y1="100" x2="480" y2="100" stroke="rgba(43,26,18,0.04)" />
                  </svg>
                </div>
              </div>

              {/* Recent Orders table */}
              <div style={styles.adminCard}>
                <h3 style={styles.cardHeader}>Recent Order logs</h3>
                <div style={styles.simpleList}>
                  {orders.map(o => (
                    <div key={o.id} style={styles.orderListItem}>
                      <div>
                        <strong>{o.id}</strong> &bull; {o.customerName}
                        <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{o.products}</div>
                      </div>
                      <span style={{ fontWeight: '700' }}>₹{o.amount}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        );
    }
  };

  return (
    <div style={styles.adminLayout}>
      
      {/* Sidebar Panel */}
      <aside style={styles.sidebar}>
        <div style={styles.logoSection}>
          <img src="/assets/logo.jfif" alt="MOVITEA" style={styles.logoImg} />
          <span style={styles.logoSub}>Atelier Operations</span>
        </div>

        <nav style={styles.sideNav}>
          <button 
            onClick={() => navigate('/admin')} 
            style={{
              ...styles.navBtn,
              backgroundColor: currentTab === 'dashboard' ? 'var(--cream-color)' : 'transparent',
              color: currentTab === 'dashboard' ? 'var(--primary-color)' : 'var(--dark-color)',
            }}
          >
            <LayoutDashboard size={18} /> Dashboard
          </button>
          
          <button 
            onClick={() => navigate('/admin/products')} 
            style={{
              ...styles.navBtn,
              backgroundColor: currentTab === 'products' ? 'var(--cream-color)' : 'transparent',
              color: currentTab === 'products' ? 'var(--primary-color)' : 'var(--dark-color)',
            }}
          >
            <Coffee size={18} /> Products
          </button>

          <button 
            onClick={() => navigate('/admin/orders')} 
            style={{
              ...styles.navBtn,
              backgroundColor: currentTab === 'orders' ? 'var(--cream-color)' : 'transparent',
              color: currentTab === 'orders' ? 'var(--primary-color)' : 'var(--dark-color)',
            }}
          >
            <ShoppingBag size={18} /> Orders
          </button>

          <button 
            onClick={() => navigate('/admin/promos')} 
            style={{
              ...styles.navBtn,
              backgroundColor: currentTab === 'promos' ? 'var(--cream-color)' : 'transparent',
              color: currentTab === 'promos' ? 'var(--primary-color)' : 'var(--dark-color)',
            }}
          >
            <Tag size={18} /> Promo Codes
          </button>
        </nav>

        <div style={styles.sidebarFooter}>
          <button onClick={() => navigate('/')} style={styles.returnBtn}>
            Return To Shop
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={styles.mainContent}>
        {renderContent()}
      </main>

    </div>
  );
}

const styles = {
  adminLayout: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#FAF7F2',
    fontFamily: 'var(--font-sans)',
  },
  sidebar: {
    width: '280px',
    backgroundColor: '#FFFFFF',
    borderRight: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    padding: '2rem 1.5rem',
    position: 'fixed',
    height: '100vh',
    top: 0,
    left: 0,
    zIndex: 100,
  },
  logoSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: '3rem',
  },
  logoImg: {
    height: '100px',
    objectFit: 'contain',
    mixBlendMode: 'multiply',
  },
  logoSub: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    color: '#8A7A6B',
    fontWeight: '700',
    marginTop: '0.25rem',
  },
  sideNav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    flex: 1,
  },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.8rem',
    padding: '0.85rem 1.25rem',
    borderRadius: '8px',
    fontSize: '0.92rem',
    fontWeight: '500',
    textAlign: 'left',
    transition: 'all 0.3s ease',
    width: '100%',
    cursor: 'pointer',
  },
  sidebarFooter: {
    marginTop: 'auto',
  },
  returnBtn: {
    width: '100%',
    padding: '0.85rem',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#2B1A12',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    transition: 'var(--transition-fast)',
  },
  mainContent: {
    flex: 1,
    padding: '3rem',
    marginLeft: '280px', // Matches sidebar width
    minWidth: 0, // prevents flex blowout
  },
  sectionContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2.5rem',
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  sectionTitle: {
    fontSize: '2.5rem',
    fontFamily: 'var(--font-serif)',
    fontWeight: '300',
    color: '#2B1A12',
  },
  sectionSubtitle: {
    fontSize: '0.9rem',
    color: '#8A7A6B',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--border-color)',
    padding: '2rem 1.5rem',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    boxShadow: '0 4px 20px rgba(43,26,18,0.02)',
  },
  statLabel: {
    fontSize: '0.82rem',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#8A7A6B',
    fontWeight: '600',
  },
  statVal: {
    fontSize: '2.2rem',
    fontWeight: '700',
    color: '#2B1A12',
  },
  dashboardLayout: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 1fr',
    gap: '2rem',
  },
  adminCard: {
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--border-color)',
    padding: '2rem',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  adminCardFull: {
    backgroundColor: '#FFFFFF',
    border: '1px solid var(--border-color)',
    padding: '2rem',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    width: '100%',
  },
  cardHeader: {
    fontSize: '1.25rem',
    fontFamily: 'var(--font-serif)',
    color: 'var(--primary-color)',
    borderBottom: '1px solid var(--border-color)',
    paddingBottom: '0.6rem',
  },
  chartArea: {
    height: '240px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  simpleList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  orderListItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: '0.8rem',
    borderBottom: '1px solid rgba(43,26,18,0.03)',
  },
  adminGrid: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 1fr',
    gap: '2.5rem',
    alignItems: 'start',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.2rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  inputGroupFull: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.78rem',
    fontWeight: '600',
    color: '#8A7A6B',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  input: {
    padding: '0.8rem 1rem',
    border: '1px solid var(--border-color)',
    fontSize: '0.9rem',
    outline: 'none',
    backgroundColor: '#FAF7F2',
  },
  select: {
    padding: '0.8rem 1rem',
    border: '1px solid var(--border-color)',
    fontSize: '0.9rem',
    outline: 'none',
    backgroundColor: '#FAF7F2',
  },
  textarea: {
    padding: '0.8rem 1rem',
    border: '1px solid var(--border-color)',
    fontSize: '0.9rem',
    outline: 'none',
    backgroundColor: '#FAF7F2',
    height: '100px',
    resize: 'vertical',
    fontFamily: 'var(--font-sans)',
  },
  checkboxRow: {
    gridColumn: '1 / -1',
    display: 'flex',
    gap: '2rem',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.88rem',
    cursor: 'pointer',
  },
  formFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '1rem',
    marginTop: '1.5rem',
    borderTop: '1px solid var(--border-color)',
    paddingTop: '1.2rem',
  },
  submitBtn: {
    backgroundColor: '#2B1A12',
    color: '#FAF7F2',
    border: 'none',
    padding: '0.85rem 1.8rem',
    fontWeight: '600',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    cursor: 'pointer',
  },
  cancelBtn: {
    backgroundColor: 'transparent',
    border: '1px solid var(--border-color)',
    color: '#8A7A6B',
    padding: '0.85rem 1.8rem',
    fontWeight: '600',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    cursor: 'pointer',
  },
  productList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  productRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(43,26,18,0.05)',
    paddingBottom: '1rem',
  },
  productRowLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  reorderButtons: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.2rem',
  },
  orderBtn: {
    padding: '0.2rem',
    border: '1px solid var(--border-color)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
    '&:hover': {
      opacity: 1,
    },
  },
  productTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#2B1A12',
  },
  productSub: {
    fontSize: '0.78rem',
    color: '#8A7A6B',
  },
  productRowActions: {
    display: 'flex',
    gap: '0.5rem',
  },
  actionBtnEdit: {
    padding: '0.4rem',
    color: 'var(--primary-color)',
    cursor: 'pointer',
  },
  actionBtnDelete: {
    padding: '0.4rem',
    color: '#C0392B',
    cursor: 'pointer',
  },
  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    textAlign: 'left',
  },
  th: {
    padding: '1rem',
    borderBottom: '2px solid var(--border-color)',
    fontSize: '0.82rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: '#8A7A6B',
  },
  tr: {
    borderBottom: '1px solid rgba(43,26,18,0.05)',
  },
  td: {
    padding: '1.2rem 1rem',
    fontSize: '0.9rem',
    color: '#2B1A12',
  },
  badge: {
    padding: '0.25rem 0.6rem',
    borderRadius: '20px',
    fontSize: '0.75rem',
    fontWeight: '600',
  },
  tableSelect: {
    padding: '0.4rem 0.8rem',
    border: '1px solid var(--border-color)',
    fontSize: '0.85rem',
    outline: 'none',
  },
  tableActionRow: {
    display: 'flex',
    gap: '0.5rem',
  },
  btnApprove: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    backgroundColor: '#27AE60',
    color: '#FFFFFF',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    fontSize: '0.78rem',
    fontWeight: '600',
    cursor: 'pointer',
  },
  btnReject: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.3rem',
    backgroundColor: '#C0392B',
    color: '#FFFFFF',
    border: 'none',
    padding: '0.4rem 0.8rem',
    borderRadius: '4px',
    fontSize: '0.78rem',
    fontWeight: '600',
    cursor: 'pointer',
  },

  // Promo management specific styles (Brand desk styles: Cream, Chocolate, Caramel/Orange)
  promoFormCard: {
    backgroundColor: '#FAF7F2',
    border: '2px solid rgba(197, 107, 31, 0.25)',
    padding: '3rem 2rem',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    boxShadow: '0 12px 30px rgba(197, 107, 31, 0.04)',
  },
  promoListCard: {
    backgroundColor: '#FAF7F2',
    border: '1px solid rgba(43,26,18,0.08)',
    padding: '2.5rem 2rem',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.8rem',
  },
  inputPromo: {
    padding: '0.8rem 1rem',
    border: '1px solid rgba(43,26,18,0.15)',
    fontSize: '0.9rem',
    outline: 'none',
    backgroundColor: '#FFFFFF',
    color: '#2B1A12',
    '&:focus': {
      borderColor: 'var(--primary-color)',
    }
  },
  submitPromoBtn: {
    backgroundColor: 'var(--primary-color)', // Caramel / Orange accent
    color: '#FFFFFF',
    border: 'none',
    padding: '0.85rem 1.8rem',
    fontWeight: '600',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  promoItemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(197,107,31,0.08)',
    paddingBottom: '1rem',
  }
};
