import React, { useState, useEffect } from 'react';
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
import { adminAPI, productsAPI, ordersAPI, promosAPI, usersAPI, cartAPI } from '../utils/api';

export default function Admin({ user }) {
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
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [promos, setPromos] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Modal / Form States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '', slug: '', price: 0, discountPrice: 0, stock: 0, orderNumber: 0, category: 'Loose Leaf', flavorType: 'Floral', active: true, featured: false, desc: '', shortDesc: ''
  });

  const [selectedPromo, setSelectedPromo] = useState(null);
  const [promoForm, setPromoForm] = useState({
    code: '', discountAmount: 0, originalPrice: 0, discountedPrice: 0, validity: '', active: true
  });

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      navigate('/');
    }
  }, [user, navigate]);

  // Fetch all data
  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [productsData, ordersData, promosData, usersData, statsData] = await Promise.all([
        productsAPI.getAdmin().catch(() => []),
        ordersAPI.getAll().catch(() => []),
        promosAPI.getAll().catch(() => []),
        usersAPI.getAll().catch(() => []),
        adminAPI.getStats().catch(() => null)
      ]);

      setProducts(productsData);
      setOrders(ordersData);
      setPromos(promosData);
      setUsersList(usersData);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Determine current active subsection based on path
  const path = location.pathname;
  const currentTab = path.includes('/products') 
    ? 'products' 
    : path.includes('/orders') 
    ? 'orders' 
    : path.includes('/promos') 
    ? 'promos' 
    : path.includes('/users')
    ? 'users'
    : 'dashboard';

  // --- PRODUCT CRUD ---
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(productForm).forEach(key => {
        formData.append(key, productForm[key]);
      });

      if (selectedProduct) {
        await productsAPI.update(selectedProduct.id, formData);
        setSelectedProduct(null);
      } else {
        await productsAPI.create(formData);
      }
      // Refresh products
      const updatedProducts = await productsAPI.getAdmin();
      setProducts(updatedProducts);
      setProductForm({
        name: '', slug: '', price: 0, discountPrice: 0, stock: 0, orderNumber: products.length + 1, category: 'Loose Leaf', flavorType: 'Floral', active: true, featured: false, desc: '', shortDesc: ''
      });
    } catch (error) {
      console.error('Product save error:', error);
      alert('Failed to save product');
    }
  };

  const editProduct = (prod) => {
    setSelectedProduct(prod);
    setProductForm({ ...prod });
  };

  const deleteProduct = async (id) => {
    if (confirm('Delete this product?')) {
      try {
        await productsAPI.delete(id);
        setProducts(products.filter(p => p.id !== id));
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete product');
      }
    }
  };

  // Reordering products
  const moveProduct = async (index, direction) => {
    const updated = [...products].sort((a, b) => a.orderNumber - b.orderNumber);
    let newIndex = index;
    
    if (direction === 'up' && index > 0) {
      newIndex = index - 1;
    } else if (direction === 'down' && index < updated.length - 1) {
      newIndex = index + 1;
    }

    if (newIndex !== index) {
      const temp = updated[index].orderNumber;
      updated[index].orderNumber = updated[newIndex].orderNumber;
      updated[newIndex].orderNumber = temp;

      try {
        await Promise.all([
          productsAPI.reorder(updated[index].id, updated[index].orderNumber),
          productsAPI.reorder(updated[newIndex].id, updated[newIndex].orderNumber)
        ]);
        setProducts(updated);
      } catch (error) {
        console.error('Reorder error:', error);
      }
    }
  };

  // --- ORDER HANDLERS ---
  const updateOrderVerification = async (orderId, status) => {
    try {
      await ordersAPI.verify(orderId, status);
      if (status === 'APPROVED') {
        // Find the order to get userId, then clear that user's cart
        const order = orders.find(o => o.id === orderId);
        if (order?.userId) {
          await cartAPI.clearUserCart(order.userId).catch(() => {});
        }
        alert('Order Approved! Customer cart has been cleared. Confirmation email will be sent.');
      }
      // Refresh orders
      const updatedOrders = await ordersAPI.getAll();
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Verification error:', error);
      alert('Failed to update verification');
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await ordersAPI.updateStatus(orderId, status);
      // Refresh orders
      const updatedOrders = await ordersAPI.getAll();
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Status update error:', error);
      alert('Failed to update status');
    }
  };

  // --- PROMO CRUD ---
  const handlePromoSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedPromo) {
        await promosAPI.update(selectedPromo.id, promoForm);
        setSelectedPromo(null);
      } else {
        await promosAPI.create(promoForm);
      }
      // Refresh promos
      const updatedPromos = await promosAPI.getAll();
      setPromos(updatedPromos);
      setPromoForm({ code: '', discountAmount: 0, originalPrice: 0, discountedPrice: 0, validity: '', active: true });
    } catch (error) {
      console.error('Promo save error:', error);
      alert('Failed to save promo code');
    }
  };

  const editPromo = (promo) => {
    setSelectedPromo(promo);
    setPromoForm({ ...promo });
  };

  const deletePromo = async (id) => {
    if (confirm('Delete this promo code?')) {
      try {
        await promosAPI.delete(id);
        setPromos(promos.filter(p => p.id !== id));
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete promo');
      }
    }
  };

  // --- USER HANDLERS ---
  const [promoteEmail, setPromoteEmail] = useState('');
  const [promoteRole, setPromoteRole] = useState('ADMIN');

  const updateUserRole = async (userId, newRole) => {
    try {
      await usersAPI.updateRole(userId, newRole);
      // Refresh users
      const updatedUsers = await usersAPI.getAll();
      setUsersList(updatedUsers);
    } catch (error) {
      console.error('Role update error:', error);
      alert('Failed to update user role');
    }
  };

  const promoteByEmail = async (e) => {
    e.preventDefault();
    if (!promoteEmail.trim()) {
      alert('Please enter an email address');
      return;
    }
    try {
      const result = await usersAPI.promoteByEmail(promoteEmail.trim(), promoteRole);
      alert(result.message || `User promoted to ${promoteRole}`);
      setPromoteEmail('');
      // Refresh users
      const updatedUsers = await usersAPI.getAll();
      setUsersList(updatedUsers);
    } catch (error) {
      console.error('Promote by email error:', error);
      alert(error.message || 'Failed to promote user');
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner} />
      </div>
    );
  }

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
                    <label style={styles.label}>Price (₹)</label>
                    <input 
                      type="number" required style={styles.input} 
                      value={productForm.price} 
                      onChange={(e) => setProductForm({ ...productForm, price: parseInt(e.target.value) })}
                    />
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Discount Price (₹)</label>
                    <input 
                      type="number" style={styles.input} 
                      value={productForm.discountPrice} 
                      onChange={(e) => setProductForm({ ...productForm, discountPrice: parseInt(e.target.value) })}
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
                      <option value="Loose Leaf">Loose Leaf</option>
                      <option value="Atelier Box">Atelier Box</option>
                      <option value="Gifting Set">Gifting Set</option>
                    </select>
                  </div>
                  <div style={styles.inputGroup}>
                    <label style={styles.label}>Flavor Type</label>
                    <input 
                      type="text" style={styles.input} 
                      value={productForm.flavorType}
                      onChange={(e) => setProductForm({ ...productForm, flavorType: e.target.value })}
                      placeholder="e.g. Floral / Decadent"
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

                  <div style={styles.inputGroupFull}>
                    <label style={styles.label}>Product Image</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setProductForm({ ...productForm, image: file });
                        }
                      }}
                      style={styles.input}
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
                      setProductForm({ name: '', slug: '', price: 0, discountPrice: 0, stock: 0, orderNumber: products.length + 1, category: 'Loose Leaf', flavorType: 'Floral', active: true, featured: false, desc: '', shortDesc: '' });
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
                          <span style={styles.productSub}>Order Pos: {prod.orderNumber} &bull; Price: ₹{prod.price}</span>
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
                        <td style={styles.td}><strong>{order.orderNumber}</strong><div style={{fontSize: '0.75rem', opacity: 0.6}}>{new Date(order.createdAt).toLocaleDateString()}</div></td>
                        <td style={styles.td}>{order.customerName}<div style={{fontSize: '0.75rem', opacity: 0.6}}>{order.customerPhone || order.user?.email}</div></td>
                        <td style={styles.td}>{order.items?.map(item => `${item.name} x${item.quantity}`).join(', ')}</td>
                        <td style={styles.td}><strong>₹{order.totalAmount}</strong></td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.badge,
                            backgroundColor: order.verificationStatus === 'APPROVED' ? '#D4EDDA' : order.verificationStatus === 'REJECTED' ? '#F8D7DA' : '#FFF3CD',
                            color: order.verificationStatus === 'APPROVED' ? '#155724' : order.verificationStatus === 'REJECTED' ? '#721C24' : '#856404'
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
                            <option value="PLACED">Placed</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.tableActionRow}>
                            <button 
                              onClick={() => updateOrderVerification(order.id, 'APPROVED')} 
                              disabled={order.verificationStatus === 'APPROVED'}
                              style={styles.btnApprove} 
                              title="Approve Transaction"
                            >
                              <Check size={14} /> Approve
                            </button>
                            <button 
                              onClick={() => updateOrderVerification(order.id, 'REJECTED')} 
                              disabled={order.verificationStatus === 'REJECTED'}
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
                    <label style={styles.label}>Discount Amount (₹)</label>
                    <input 
                      type="number" required style={styles.inputPromo} 
                      value={promoForm.discountAmount} 
                      onChange={(e) => setPromoForm({ ...promoForm, discountAmount: parseInt(e.target.value) })}
                    />
                  </div>
                  <div style={styles.inputGroup}>
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
                      setPromoForm({ code: '', discountAmount: 0, originalPrice: 0, discountedPrice: 0, validity: '', active: true });
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
                          Discount: ₹{promo.discountAmount}
                        </p>
                        <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Valid until: {new Date(promo.validity).toLocaleDateString()}</span>
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

      case 'users':
        return (
          <div style={styles.sectionContainer}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>User Management</h2>
              <span style={styles.sectionSubtitle}>Manage customer and admin roles</span>
            </div>

            {/* Promote by Email Form */}
            <div style={styles.promoteByEmailCard}>
              <h3 style={styles.cardHeader}>Make Admin by Email</h3>
              <form onSubmit={promoteByEmail} style={styles.promoteForm}>
                <div style={styles.promoteInputRow}>
                  <input
                    type="email"
                    placeholder="Enter user email address"
                    value={promoteEmail}
                    onChange={(e) => setPromoteEmail(e.target.value)}
                    style={styles.promoteInput}
                    required
                  />
                  <select
                    value={promoteRole}
                    onChange={(e) => setPromoteRole(e.target.value)}
                    style={styles.promoteSelect}
                  >
                    <option value="ADMIN">Admin</option>
                    <option value="CUSTOMER">Customer</option>
                  </select>
                  <button type="submit" style={styles.promoteBtn}>
                    <Sparkles size={14} /> Update Role
                  </button>
                </div>
              </form>
            </div>

            <div style={styles.adminCardFull}>
              <h3 style={styles.cardHeader}>All Users</h3>
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>User</th>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Role</th>
                      <th style={styles.th}>Orders</th>
                      <th style={styles.th}>Joined</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map(u => (
                      <tr key={u.id} style={styles.tr}>
                        <td style={styles.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {u.image ? (
                              <img src={u.image} alt={u.name} style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--cream-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Users size={16} color="var(--primary-color)" />
                              </div>
                            )}
                            <span>{u.name || 'No Name'}</span>
                          </div>
                        </td>
                        <td style={styles.td}>{u.email}</td>
                        <td style={styles.td}>
                          <span style={{
                            ...styles.badge,
                            backgroundColor: u.role === 'ADMIN' ? '#E8D5F5' : '#D4EDDA',
                            color: u.role === 'ADMIN' ? '#6C3483' : '#155724'
                          }}>
                            {u.role}
                          </span>
                        </td>
                        <td style={styles.td}>{u._count?.orders || 0}</td>
                        <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td style={styles.td}>
                          {u.id !== user?.id && (
                            <select
                              value={u.role}
                              onChange={(e) => updateUserRole(u.id, e.target.value)}
                              style={styles.tableSelect}
                            >
                              <option value="CUSTOMER">Customer</option>
                              <option value="ADMIN">Admin</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
                <span style={styles.statVal}>₹{stats?.totalRevenue?.toLocaleString() || '0'}</span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Total Orders</span>
                <span style={styles.statVal}>{stats?.totalOrders || 0}</span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Pending Verification</span>
                <span style={{ ...styles.statVal, color: 'var(--primary-color)' }}>{stats?.pendingVerification || 0}</span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Completed Shipments</span>
                <span style={styles.statVal}>{stats?.completedShipments || 0}</span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Active Blends Listed</span>
                <span style={styles.statVal}>{stats?.activeProducts || products.length}</span>
              </div>
              <div style={styles.statCard}>
                <span style={styles.statLabel}>Total Users</span>
                <span style={styles.statVal}>{stats?.totalUsers || 0}</span>
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
                  {orders.slice(0, 5).map(o => (
                    <div key={o.id} style={styles.orderListItem}>
                      <div>
                        <strong>{o.orderNumber}</strong> &bull; {o.customerName}
                        <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{o.items?.map(item => `${item.name} x${item.quantity}`).join(', ')}</div>
                      </div>
                      <span style={{ fontWeight: '700' }}>₹{o.totalAmount}</span>
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

          <button 
            onClick={() => navigate('/admin/users')} 
            style={{
              ...styles.navBtn,
              backgroundColor: currentTab === 'users' ? 'var(--cream-color)' : 'transparent',
              color: currentTab === 'users' ? 'var(--primary-color)' : 'var(--dark-color)',
            }}
          >
            <Users size={18} /> Users
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
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100%',
  },
  spinner: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    border: '2px solid var(--cream-color)',
    borderTopColor: 'var(--primary-color)',
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
    marginLeft: '280px',
    minWidth: 0,
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

  // Promo management specific styles
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
    backgroundColor: 'var(--primary-color)',
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
  },
  promoteByEmailCard: {
    backgroundColor: '#FFFFFF',
    border: '2px solid var(--primary-color)',
    padding: '2rem',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  promoteForm: {
    width: '100%',
  },
  promoteInputRow: {
    display: 'flex',
    gap: '0.8rem',
    alignItems: 'center',
  },
  promoteInput: {
    flex: 1,
    padding: '0.8rem 1rem',
    border: '1px solid var(--border-color)',
    fontSize: '0.9rem',
    outline: 'none',
    backgroundColor: '#FAF7F2',
  },
  promoteSelect: {
    padding: '0.8rem 1rem',
    border: '1px solid var(--border-color)',
    fontSize: '0.9rem',
    outline: 'none',
    backgroundColor: '#FAF7F2',
    minWidth: '140px',
  },
  promoteBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.4rem',
    backgroundColor: 'var(--primary-color)',
    color: '#FFFFFF',
    border: 'none',
    padding: '0.8rem 1.5rem',
    fontWeight: '600',
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    cursor: 'pointer',
    borderRadius: '4px',
    whiteSpace: 'nowrap',
  },
};
