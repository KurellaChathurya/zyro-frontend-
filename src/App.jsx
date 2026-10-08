import React, { useEffect, useState, useRef } from 'react';
import { getAllItems, createItem } from './services/itemService';
import Register from './components/Register';
import Login from './components/Login';
import './App.css';

function App() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [authView, setAuthView] = useState('role-select');
  const [currentUser, setCurrentUser] = useState(null);

  const [activeView, setActiveView] = useState('shop');
  const [profileTab, setProfileTab] = useState('orders');

  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedGender, setSelectedGender] = useState('ALL');

  const [isListening, setIsListening] = useState(false);
  const [isImageSearching, setIsImageSearching] = useState(false);
  const [searchImagePreview, setSearchImagePreview] = useState(null);

  // AI Stylist Studio State
  const [stylistInputs, setStylistInputs] = useState({
    eventType: 'Wedding Reception',
    skinTone: 'Fair / Wheatish',
    colorPref: 'Royal Velvet Maroon / Gold'
  });
  const [stylistResult, setStylistResult] = useState(null);

  // Selected Product for Details & Checkout
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');
  const [rentDays, setRentDays] = useState(3);
  const [deliveryMethod, setDeliveryMethod] = useState('self-pickup');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: 'Kurella Chathurya',
    phone: '9876543210',
    doorNo: 'Flat 402, Royal Residency',
    area: 'Gachibowli, Hyderabad',
    pincode: '500032'
  });

  // Inspection Modal State for Owner
  const [inspectingOrder, setInspectingOrder] = useState(null);
  const [damageReason, setDamageReason] = useState('');
  const [damageFee, setDamageFee] = useState(0);
  const [alertMessage, setAlertMessage] = useState(null);

  // Renter Item Listing State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    category: 'Dresses',
    rentalPricePerDay: '',
    securityDeposit: '',
    sizes: 'M, L',
    bookedDates: '',
    pickupAddress: '',
    city: 'Hyderabad',
    pincode: '',
    pickupMode: 'Both (Self-Pickup & Courier)',
    ownerPhone: '9876543210',
    imageUrl: '',
    videoUrl: '',
    available: true
  });

  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const imageSearchInputRef = useRef(null);

  // Active Rentals
  const [activeRentals, setActiveRentals] = useState([
    {
      id: 'ZYR-9041',
      title: 'Pink Heritage Bridal Silk Lehenga',
      category: 'Dresses',
      days: 3,
      pickupAddress: 'Road No 12, Banjara Hills, Hyderabad',
      pickupMode: 'Self-Pickup by Customer',
      ownerPhone: '9848012345',
      securityDeposit: 4000,
      amount: '₹4,500',
      status: 'Returned - Inspection Pending',
      inspectionNote: '',
      date: '03 Oct 2026'
    }
  ]);

  const [pastRentals, setPastRentals] = useState([
    {
      id: 'ZYR-8120',
      title: 'Emerald Kundan Choker Necklace Set',
      category: 'Jewellery',
      days: 2,
      pickupAddress: 'Kondapur, Hyderabad',
      pickupMode: 'Zyro Courier',
      amount: '₹1,600',
      status: 'Returned & Full Deposit Refunded',
      date: '20 Sep 2026'
    }
  ]);

  // Renter Wardrobe Listings
  const [renterListings, setRenterListings] = useState([
    {
      id: 'LST-101',
      title: 'Heavy Zardozi Velvet Bridal Lehenga',
      category: 'Dresses',
      rentalPricePerDay: 2499,
      securityDeposit: 5000,
      sizes: 'S, M, L',
      bookedDates: '12 Oct - 15 Oct 2026',
      pickupAddress: 'Flat 204, Fortune Heights, Madhapur',
      city: 'Hyderabad',
      pincode: '500081',
      pickupMode: 'Both (Self-Pickup & Courier)',
      ownerPhone: '9848012345',
      status: 'Active / Available',
      imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=500&auto=format&fit=crop&q=60'
    },
    {
      id: 'LST-102',
      title: 'Imperial Velvet Groom Sherwani with Stole',
      category: 'Dresses',
      rentalPricePerDay: 1899,
      securityDeposit: 4000,
      sizes: 'L, XL',
      bookedDates: 'Booked till 18 Oct 2026',
      pickupAddress: 'Plot 45, Jubilee Hills, Hyderabad',
      city: 'Hyderabad',
      pincode: '500033',
      pickupMode: 'Self-Pickup Only',
      ownerPhone: '9988776655',
      status: 'Currently Rented Out',
      imageUrl: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=500&auto=format&fit=crop&q=60'
    }
  ]);

  const fetchItems = () => {
    setLoading(true);
    getAllItems()
      .then((res) => {
        setItems(res.data);
        setFilteredItems(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching items:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (currentUser) {
      fetchItems();
    }
  }, [currentUser]);

  useEffect(() => {
    let result = items;
    if (activeView === 'wishlist') {
      result = result.filter(item => wishlist.includes(item.id));
    }
    if (selectedCategory !== 'ALL') {
      result = result.filter(item => item.category?.toLowerCase() === selectedCategory.toLowerCase());
    }
    if (selectedGender !== 'ALL') {
      result = result.filter(item => {
        const text = ((item.title || '') + " " + (item.description || '')).toLowerCase();
        return text.includes(selectedGender.toLowerCase());
      });
    }
    if (searchTerm.trim() !== '') {
      result = result.filter(item =>
        (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.pickupAddress || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.city || '').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredItems(result);
  }, [searchTerm, selectedCategory, selectedGender, activeView, items, wishlist]);

  // AI Stylist Studio Generator
  const generateAIStylistLook = () => {
    setStylistResult({
      dressRecommendation: `Handcrafted ${stylistInputs.colorPref} Velvet Heritage Lehenga / Saree`,
      jewelleryMatch: 'Traditional Polki Kundan Choker with Pearl Drop Earrings & Matching Maang Tikka',
      hairStyle: 'Textured Soft Braided Bun with Fresh Jasmine Gajra or Hollywood Waves',
      eventVerdict: `Apt for ${stylistInputs.eventType}! Idi royal look ni present chesthu photographs lo standout ga kanipistundi.`
    });
  };

  // Voice Search
  const handleVoiceSearch = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return alert("Browser does not support voice search.");
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      setSearchTerm(e.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  // Image Search
  const handleImageSearchUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSearchImagePreview(reader.result);
        setIsImageSearching(true);
        const clean = file.name.split('.')[0].replace(/[-_]/g, ' ');
        setSearchTerm(clean.length > 2 ? clean : 'Lehenga');
      };
      reader.readAsDataURL(file);
    }
  };

  // Direct WhatsApp Connect
  const handleWhatsAppChat = (phone, title) => {
    const text = `Namaste! Nenu Zyro app lo mee '${title}' dress gurinchi pickup and booking details coordinate cheyadaniki message chesthunaanu.`;
    window.open(`https://api.whatsapp.com/send?phone=${phone.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(text)}`, '_blank');
  };

  // Owner Inspection Decisions
  const handleApproveRefund = (ord) => {
    const msg = `✅ Verification Successful: Order #${ord.id} checked by owner. No damages found! Full security deposit of ₹${ord.securityDeposit} has been initiated to your UPI account.`;
    setAlertMessage(msg);
    setActiveRentals(activeRentals.map(o => o.id === ord.id ? { ...o, status: 'Verified: Full Deposit Refunded' } : o));
    setInspectingOrder(null);
  };

  const handleReportDamage = (ord) => {
    if (!damageReason.trim() || damageFee <= 0) {
      return alert("Damage reason mariyu valid deduction fee enter cheyandi.");
    }
    const remaining = (ord.securityDeposit || 4000) - Number(damageFee);
    const msg = `⚠️ Inspection Alert: Order #${ord.id} lo owner damage report chesaru: '${damageReason}'. Deducted repair charge: ₹${damageFee}. Remaining ₹${remaining} deposit account ki refund avthundi.`;
    setAlertMessage(msg);
    setActiveRentals(activeRentals.map(o => o.id === ord.id ? { 
      ...o, 
      status: `Damage Fee Deducted (₹${damageFee})`,
      inspectionNote: damageReason
    } : o));
    setInspectingOrder(null);
    setDamageReason('');
    setDamageFee(0);
  };

  // Camera Handlers
  const startCamera = async () => {
    setIsCameraActive(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch {
      alert("Camera access denied.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const c = canvasRef.current;
      const v = videoRef.current;
      c.width = v.videoWidth || 640;
      c.height = v.videoHeight || 480;
      c.getContext('2d').drawImage(v, 0, 0, c.width, c.height);
      const url = c.toDataURL('image/jpeg', 0.85);
      setCapturedImage(url);
      setNewItem(prev => ({ ...prev, imageUrl: url }));
      stopCamera();
    }
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItem.title.trim()) return alert("Title is required!");
    if (!newItem.pickupAddress.trim()) return alert("Pickup address is required!");

    setSubmitting(true);
    try {
      const img = capturedImage || newItem.imageUrl || "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=500&auto=format&fit=crop&q=60";
      const payload = {
        ...newItem,
        rentalPricePerDay: parseFloat(newItem.rentalPricePerDay) || 0,
        securityDeposit: parseFloat(newItem.securityDeposit) || 0,
        imageUrl: img
      };
      await createItem(payload);

      setRenterListings([
        {
          id: `LST-${Date.now().toString().slice(-4)}`,
          title: payload.title,
          category: payload.category,
          rentalPricePerDay: payload.rentalPricePerDay,
          securityDeposit: payload.securityDeposit,
          sizes: payload.sizes,
          bookedDates: payload.bookedDates || 'Available Now',
          pickupAddress: payload.pickupAddress,
          city: payload.city,
          pincode: payload.pincode,
          pickupMode: payload.pickupMode,
          ownerPhone: payload.ownerPhone,
          status: 'Active / Available',
          imageUrl: payload.imageUrl
        },
        ...renterListings
      ]);

      alert("🎉 Dress successfully listed with complete pickup location!");
      setIsModalOpen(false);
      setCapturedImage(null);
      fetchItems();
    } catch {
      alert("Failed to list item.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmOrder = () => {
    if (!agreedToTerms) {
      return alert("Please agree to the Rental Care & Damage Protection Policy to proceed.");
    }
    const total = (selectedProduct.rentalPricePerDay * rentDays) + (selectedProduct.securityDeposit || 0);
    const newOrd = {
      id: `ZYR-${Math.floor(1000 + Math.random() * 9000)}`,
      title: selectedProduct.title,
      category: selectedProduct.category,
      days: rentDays,
      amount: `₹${total}`,
      securityDeposit: selectedProduct.securityDeposit || 4000,
      pickupAddress: selectedProduct.pickupAddress || 'Banjara Hills, Hyderabad',
      pickupMode: deliveryMethod === 'self-pickup' ? 'Self-Pickup by Customer' : 'Zyro Express Courier',
      ownerPhone: selectedProduct.ownerPhone || '9876543210',
      status: 'Booking Confirmed (Ready for Handover)',
      date: 'Today'
    };
    setActiveRentals([newOrd, ...activeRentals]);
    setIsCheckoutOpen(false);
    setSelectedProduct(null);
    setAgreedToTerms(false);
    alert(`🎉 Rental Booked! Mode: ${newOrd.pickupMode}. Owner phone and pickup address profile lo chudandi.`);
  };

  const navigateTo = (view) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Top Navbar */}
      <nav className="navbar">
        <div className="brand-wrapper" onClick={() => navigateTo('shop')}>
          <img src="/logo.png" alt="Zyro Logo" className="brand-logo-img" onError={(e) => { e.target.style.display = 'none'; }} />
          <div className="brand-title">Zyro.</div>
        </div>

        <div className="user-badge">
          {currentUser && (
            <>
              {selectedRole === 'customer' ? (
                <>
                  <button className={`nav-btn ${activeView === 'wishlist' ? 'active-nav-pill' : ''}`} onClick={() => navigateTo(activeView === 'wishlist' ? 'shop' : 'wishlist')}>
                    ❤️ Wishlist ({wishlist.length})
                  </button>
                  <button className={`nav-btn ${activeView === 'profile' ? 'active-nav-pill' : ''}`} onClick={() => navigateTo(activeView === 'profile' ? 'shop' : 'profile')}>
                    👤 {currentUser.name}
                  </button>
                </>
              ) : (
                <button className={`nav-btn ${activeView === 'renter-dashboard' ? 'active-nav-pill' : ''}`} onClick={() => navigateTo('renter-dashboard')}>
                  👗 Renter Dashboard
                </button>
              )}
              <button className="btn-secondary" onClick={() => { setCurrentUser(null); setSelectedRole(null); setAuthView('role-select'); }}>
                Logout
              </button>
            </>
          )}

          {!currentUser && authView !== 'role-select' && (
            <button className="btn-secondary" onClick={() => { setAuthView('role-select'); setSelectedRole(null); }}>
              ⇄ Switch Role
            </button>
          )}
        </div>
      </nav>

      {/* Global Alerts Banner */}
      {alertMessage && (
        <div style={{ background: '#fdf2f8', borderBottom: '2px solid #db2777', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#be185d', fontWeight: 700 }}>{alertMessage}</span>
          <button className="btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }} onClick={() => setAlertMessage(null)}>✕ Close</button>
        </div>
      )}

      <div className="container">
        {/* ================== ROLE SELECTION & AUTH ================== */}
        {!currentUser ? (
          <div>
            {authView === 'role-select' ? (
              <div style={{ maxWidth: '780px', margin: '3rem auto', textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#db2777', background: '#fdf2f8', padding: '4px 14px', borderRadius: '20px', border: '1px solid #fce7f0' }}>
                  WELCOME TO ZYRO COUTURE
                </span>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#1f161a', margin: '1rem 0 0.5rem' }}>
                  Who are you joining as today?
                </h2>
                <p style={{ color: '#705b64', fontSize: '0.95rem', marginBottom: '2.5rem' }}>
                  Explore designer wardrobes with AI Stylist or list your outfits with verified pickup locations.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', textAlign: 'left' }}>
                  <div 
                    onClick={() => { setSelectedRole('customer'); setAuthView('register'); }}
                    style={{ background: '#ffffff', border: '2px solid #fce7f0', borderRadius: '24px', padding: '2rem', cursor: 'pointer' }}
                  >
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛍️</div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1f161a', marginBottom: '6px' }}>I am a Customer</h3>
                    <p style={{ fontSize: '0.85rem', color: '#705b64', lineHeight: '1.5' }}>
                      Access AI Stylist Studio, voice/photo search, pickup points, and verified security deposit refund protection.
                    </p>
                    <div style={{ marginTop: '1.5rem', fontWeight: 800, color: '#db2777', fontSize: '0.9rem' }}>
                      Continue to Customer Registration →
                    </div>
                  </div>

                  <div 
                    onClick={() => { setSelectedRole('renter'); setAuthView('register'); }}
                    style={{ background: '#ffffff', border: '2px solid #fce7f0', borderRadius: '24px', padding: '2rem', cursor: 'pointer' }}
                  >
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>👗</div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1f161a', marginBottom: '6px' }}>I am an Owner / Renter</h3>
                    <p style={{ fontSize: '0.85rem', color: '#705b64', lineHeight: '1.5' }}>
                      List your ethnic wear with pickup address, set occupied calendar dates, and inspect returned dresses safely.
                    </p>
                    <div style={{ marginTop: '1.5rem', fontWeight: 800, color: '#db2777', fontSize: '0.9rem' }}>
                      Continue to Renter Registration →
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ maxWidth: '440px', margin: '2rem auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#db2777', background: '#fdf2f8', padding: '3px 12px', borderRadius: '12px' }}>
                    {selectedRole === 'customer' ? '🛍️ Customer Portal' : '👗 Renter & Boutique Partner Portal'}
                  </span>
                </div>

                {authView === 'login' ? (
                  <Login
                    onLoginSuccess={(user) => {
                      setCurrentUser(user);
                      setActiveView(selectedRole === 'renter' ? 'renter-dashboard' : 'shop');
                    }}
                    onSwitchToRegister={() => setAuthView('register')}
                  />
                ) : (
                  <Register onSwitchToLogin={() => setAuthView('login')} />
                )}

                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                  <button className="btn-secondary" style={{ fontSize: '0.8rem' }} onClick={() => { setAuthView('role-select'); setSelectedRole(null); }}>
                    ← Back to Role Selection
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : activeView === 'renter-dashboard' ? (
          /* ================== RENTER DASHBOARD ================== */
          <div className="profile-wrapper">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1f161a' }}>👗 Renter Partner Dashboard</h2>
                <p style={{ color: '#705b64', fontSize: '0.9rem' }}>Manage listings, inspect returned garments, and control security deposit releases.</p>
              </div>
              <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ List New Outfit</button>
            </div>

            {/* Inspections Alert Section for Owner */}
            <div style={{ background: '#fff', border: '1.5px solid #fce7f0', borderRadius: '20px', padding: '1.5rem', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#be185d', marginBottom: '1rem' }}>
                🔍 Garments Returned: Pending Inspection & Deposit Release
              </h3>

              {activeRentals.filter(r => r.status.includes('Inspection Pending')).length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: '#705b64' }}>No pending inspections right now. All returned outfits are verified.</p>
              ) : (
                activeRentals.filter(r => r.status.includes('Inspection Pending')).map(ord => (
                  <div key={ord.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fdf2f8', padding: '1rem', borderRadius: '14px', border: '1px solid #fbcfe8' }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 800 }}>{ord.title} (Order #{ord.id})</h4>
                      <p style={{ fontSize: '0.8rem', color: '#4b5563' }}>Customer Deposit Held: <strong>₹{ord.securityDeposit}</strong></p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleApproveRefund(ord)}>
                        ✅ No Damage (Release Refund)
                      </button>
                      <button className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', color: '#b91c1c' }} onClick={() => setInspectingOrder(ord)}>
                        ⚠️ Report Damage
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Listed Outfits with Calendar Booked Dates */}
            <div style={{ background: '#fff', border: '1.5px solid #fce7f0', borderRadius: '20px', padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1f161a', marginBottom: '1rem' }}>
                Your Listed Outfits & Occupied Dates
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {renterListings.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff9fb', border: '1px solid #fce7f0', borderRadius: '16px', padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
                      <img src={item.imageUrl} alt={item.title} style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '12px' }} />
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#db2777' }}>{item.category} • {item.id}</span>
                        <h4 style={{ fontSize: '1rem', fontWeight: 800, margin: '2px 0' }}>{item.title}</h4>
                        <p style={{ fontSize: '0.8rem', color: '#4b5563' }}>📍 Pickup: {item.pickupAddress}, {item.city}</p>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', background: '#fef3c7', padding: '2px 6px', borderRadius: '6px' }}>
                          📅 Booked Dates: {item.bookedDates || 'Available Anytime'}
                        </span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.15rem', fontWeight: 900, color: '#db2777' }}>₹{item.rentalPricePerDay} / day</div>
                      <button className="btn-secondary" style={{ marginTop: '6px', fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => handleWhatsAppChat(item.ownerPhone, item.title)}>
                        💬 Test WhatsApp
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : activeView === 'profile' ? (
          /* ================== CUSTOMER PROFILE ================== */
          <div className="profile-wrapper">
            <button onClick={() => navigateTo('shop')} className="btn-secondary" style={{ marginBottom: '1.2rem', fontWeight: 700 }}>
              ← Back to Catalog
            </button>

            <div style={{ background: '#ffffff', border: '1.5px solid #fce7f0', borderRadius: '24px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div className="profile-avatar">{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}</div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{currentUser.name}</h3>
                <p style={{ color: '#705b64' }}>✉️ {currentUser.email} • 💎 Zyro Verified Customer</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #fce7f0', margin: '1.5rem 0' }}>
              <button className={`profile-tab ${profileTab === 'orders' ? 'active' : ''}`} onClick={() => setProfileTab('orders')}>
                Active Rentals ({activeRentals.length})
              </button>
              <button className={`profile-tab ${profileTab === 'past' ? 'active' : ''}`} onClick={() => setProfileTab('past')}>
                Past Bookings ({pastRentals.length})
              </button>
            </div>

            {profileTab === 'orders' ? (
              activeRentals.map(ord => (
                <div key={ord.id} className="meesho-order-card">
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#db2777' }}>{ord.id} • {ord.category}</span>
                    <h4 style={{ margin: '4px 0', fontSize: '1.1rem' }}>{ord.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#4b5563' }}>📍 Pickup Address: <strong>{ord.pickupAddress}</strong></p>
                    <p style={{ fontSize: '0.8rem', color: '#705b64' }}>Deposit: ₹{ord.securityDeposit} • Mode: {ord.pickupMode}</p>
                    {ord.inspectionNote && (
                      <p style={{ fontSize: '0.8rem', color: '#b91c1c', fontWeight: 700, marginTop: '4px' }}>
                        Notice: {ord.inspectionNote}
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#db2777', marginBottom: '6px' }}>{ord.amount}</div>
                    <div style={{ marginBottom: '6px' }}>
                      <span style={{ background: ord.status.includes('Verified') ? '#ecfdf5' : '#fef3c7', color: ord.status.includes('Verified') ? '#047857' : '#b45309', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {ord.status}
                      </span>
                    </div>
                    <button className="btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 10px' }} onClick={() => handleWhatsAppChat(ord.ownerPhone || '9876543210', ord.title)}>
                      💬 Chat with Owner
                    </button>
                  </div>
                </div>
              ))
            ) : (
              pastRentals.map(ord => (
                <div key={ord.id} className="meesho-order-card">
                  <div>
                    <h4 style={{ margin: '4px 0' }}>{ord.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: '#705b64' }}>Returned: {ord.date}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ background: '#f1f5f9', color: '#475569', padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem' }}>
                      {ord.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* ================== SHOP & SEARCH VIEW WITH AI STYLIST STUDIO ================== */
          <div>
            {/* 1. UNIQUE AI PERSONAL STYLIST STUDIO */}
            <div style={{ background: 'linear-gradient(135deg, #fff0f5 0%, #fff 100%)', border: '2px solid #fce7f0', borderRadius: '24px', padding: '1.8rem', margin: '1rem 0 2rem', boxShadow: '0 8px 30px rgba(236,72,153,0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontSize: '1.5rem' }}>✨</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#831843', margin: 0 }}>
                  Zyro AI Personal Stylist & Event Matchmaker
                </h3>
                <span style={{ background: '#db2777', color: '#fff', fontSize: '0.65rem', fontWeight: 800, padding: '2px 8px', borderRadius: '10px' }}>
                  EXCLUSIVE
                </span>
              </div>
              <p style={{ color: '#705b64', fontSize: '0.85rem', margin: '4px 0 1rem' }}>
                Enter your event details, skin tone & preferences to receive customized dress, jewellery & hairstyle recommendations.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#705b64' }}>Event Type</label>
                  <select 
                    style={{ width: '100%', padding: '8px', borderRadius: '10px', border: '1px solid #fbcfe8', fontSize: '0.85rem', marginTop: '4px' }}
                    value={stylistInputs.eventType} 
                    onChange={(e) => setStylistInputs({ ...stylistInputs, eventType: e.target.value })}
                  >
                    <option>Wedding Reception</option>
                    <option>Sangeet Night</option>
                    <option>Haldi / Mehendi Ceremony</option>
                    <option>Engagement / Ring Ceremony</option>
                    <option>Festive Celebration</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#705b64' }}>Complexion / Tone</label>
                  <select 
                    style={{ width: '100%', padding: '8px', borderRadius: '10px', border: '1px solid #fbcfe8', fontSize: '0.85rem', marginTop: '4px' }}
                    value={stylistInputs.skinTone} 
                    onChange={(e) => setStylistInputs({ ...stylistInputs, skinTone: e.target.value })}
                  >
                    <option>Fair / Cool Undertone</option>
                    <option>Wheatish / Warm Undertone</option>
                    <option>Dusky / Deep Undertone</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#705b64' }}>Preferred Color Palette</label>
                  <input 
                    type="text" 
                    style={{ width: '100%', padding: '7px', borderRadius: '10px', border: '1px solid #fbcfe8', fontSize: '0.85rem', marginTop: '4px' }}
                    value={stylistInputs.colorPref}
                    onChange={(e) => setStylistInputs({ ...stylistInputs, colorPref: e.target.value })}
                  />
                </div>
              </div>

              <button className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem' }} onClick={generateAIStylistLook}>
                ✨ Generate My Complete AI Look
              </button>

              {stylistResult && (
                <div style={{ marginTop: '1.2rem', background: '#fff', border: '1.5px solid #fbcfe8', borderRadius: '18px', padding: '1.2rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div style={{ background: '#fdf2f8', padding: '10px', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#db2777' }}>👗 Recommended Outfit</span>
                      <p style={{ fontSize: '0.85rem', color: '#1f161a', fontWeight: 700, marginTop: '2px' }}>{stylistResult.dressRecommendation}</p>
                    </div>
                    <div style={{ background: '#fdf2f8', padding: '10px', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#db2777' }}>💎 Matching Jewellery</span>
                      <p style={{ fontSize: '0.85rem', color: '#1f161a', fontWeight: 700, marginTop: '2px' }}>{stylistResult.jewelleryMatch}</p>
                    </div>
                    <div style={{ background: '#fdf2f8', padding: '10px', borderRadius: '12px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#db2777' }}>💇 Hairstyle Idea</span>
                      <p style={{ fontSize: '0.85rem', color: '#1f161a', fontWeight: 700, marginTop: '2px' }}>{stylistResult.hairStyle}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 700, marginTop: '10px' }}>
                    ✔ Stylist Verdict: {stylistResult.eventVerdict}
                  </p>
                </div>
              )}
            </div>

            {/* 2. SEARCH BAR & FILTERS */}
            <div className="toolbar" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: '280px', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  className="search-input"
                  placeholder={isListening ? "Listening... Speak now!" : "Search outfits, jewellery, or location..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', paddingRight: '70px', borderColor: isListening ? '#db2777' : '' }}
                />
                <button type="button" onClick={handleVoiceSearch} title="Voice Search" style={{ position: 'absolute', right: '38px', background: isListening ? '#fee2e2' : 'transparent', border: 'none', fontSize: '1.1rem', cursor: 'pointer', padding: '4px' }}>
                  {isListening ? '🔴' : '🎙️'}
                </button>
                <button type="button" onClick={() => imageSearchInputRef.current.click()} title="Search by Photo" style={{ position: 'absolute', right: '8px', background: 'transparent', border: 'none', fontSize: '1.1rem', cursor: 'pointer' }}>
                  📸
                </button>
                <input type="file" ref={imageSearchInputRef} accept="image/*" onChange={handleImageSearchUpload} style={{ display: 'none' }} />
              </div>

              <select className="filter-select" value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
                <option value="ALL">All Genders</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Kids">Kids</option>
              </select>

              <select className="filter-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="ALL">All Categories</option>
                <option value="Dresses">Dresses</option>
                <option value="Accessories">Accessories</option>
                <option value="Jewellery">Jewellery</option>
              </select>

              <button className="btn-primary" onClick={() => setIsModalOpen(true)}>+ List Item</button>
            </div>

            {/* 3. PRODUCT CARDS WITH CALENDAR BOOKED DATES BADGE */}
            {loading ? (
              <p style={{ textAlign: 'center', marginTop: '2rem' }}>Loading items...</p>
            ) : (
              <div className="cards-grid">
                {filteredItems.map((item) => (
                  <div key={item.id} className="product-card" onClick={() => setSelectedProduct(item)}>
                    <button className="like-btn" onClick={(e) => { e.stopPropagation(); wishlist.includes(item.id) ? setWishlist(wishlist.filter(i => i !== item.id)) : setWishlist([...wishlist, item.id]); }}>
                      {wishlist.includes(item.id) ? '❤️' : '🤍'}
                    </button>

                    <img src={item.imageUrl || "https://images.unsplash.com/photo-1518049362265-d5b2a6467637?w=500&auto=format&fit=crop&q=60"} alt={item.title} className="product-img" />

                    <div className="product-body">
                      <div className="tags-row">
                        <span className="tag tag-cat">{item.category}</span>
                        <span className="tag tag-gender" style={{ background: '#f0fdf4', color: '#166534' }}>📍 {item.city || 'Hyderabad'}</span>
                      </div>

                      <h3 className="product-title">{item.title}</h3>
                      <p style={{ fontSize: '0.75rem', color: '#705b64', margin: '2px 0' }}>
                        Pickup: {item.pickupAddress ? item.pickupAddress.slice(0, 30) + '...' : 'Available in Hyderabad'}
                      </p>

                      {/* Booked Dates Badge */}
                      <div style={{ margin: '6px 0' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#9a3412', background: '#ffedd5', padding: '2px 8px', borderRadius: '6px' }}>
                          📅 {item.bookedDates || 'Available Now'}
                        </span>
                      </div>

                      <div className="product-pricing">
                        <div>
                          <span className="price">₹{item.rentalPricePerDay}</span>
                          <span style={{ fontSize: '0.8rem', color: '#705b64' }}> / day</span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#705b64' }}>Deposit: ₹{item.securityDeposit}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ================== PRODUCT DETAILS MODAL ================== */}
        {selectedProduct && (
          <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <button className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.85rem' }} onClick={() => setSelectedProduct(null)}>
                  ← Back to Catalog
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="btn-secondary" style={{ padding: '4px 10px', fontSize: '0.85rem' }} onClick={() => handleWhatsAppChat(selectedProduct.ownerPhone || '9876543210', selectedProduct.title)}>
                    💬 Chat with Owner
                  </button>
                  <button className="btn-secondary" style={{ padding: '4px 10px' }} onClick={() => setSelectedProduct(null)}>✕</button>
                </div>
              </div>

              <div className="details-grid">
                <div>
                  <img src={selectedProduct.imageUrl} alt={selectedProduct.title} style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '14px' }} />
                  
                  <div style={{ marginTop: '1rem', background: '#fff5f8', padding: '10px', borderRadius: '12px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#be185d' }}>📍 Pickup Address:</div>
                    <p style={{ fontSize: '0.85rem', color: '#374151', margin: '2px 0' }}>{selectedProduct.pickupAddress || 'Road No 12, Banjara Hills, Hyderabad'}</p>
                    <p style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 700 }}>📅 Booked Calendar: {selectedProduct.bookedDates || 'Ready for immediate booking'}</p>
                  </div>
                </div>

                <div>
                  <h2 style={{ fontSize: '1.4rem' }}>{selectedProduct.title}</h2>
                  <div style={{ margin: '0.6rem 0' }}>
                    <span className="price" style={{ fontSize: '1.6rem' }}>₹{selectedProduct.rentalPricePerDay}</span>
                    <span style={{ color: '#705b64', fontSize: '0.9rem' }}> / day</span>
                    <p style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
                      🛡️ Refundable Security Deposit: ₹{selectedProduct.securityDeposit}
                    </p>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#705b64', display: 'block', marginBottom: '4px' }}>Available Sizes:</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {(selectedProduct.sizes ? selectedProduct.sizes.split(',') : ['S', 'M', 'L']).map(s => (
                        <button key={s.trim()} className={`size-pill ${selectedSize === s.trim() ? 'active' : ''}`} onClick={() => setSelectedSize(s.trim())}>
                          {s.trim()}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#705b64', display: 'block', marginBottom: '4px' }}>Rental Duration:</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[2, 3, 5, 7].map(d => (
                        <button key={d} className={`size-pill ${rentDays === d ? 'active' : ''}`} onClick={() => setRentDays(d)}>{d} Days</button>
                      ))}
                    </div>
                  </div>

                  <button className="btn-primary" style={{ width: '100%', padding: '0.9rem' }} onClick={() => setIsCheckoutOpen(true)}>
                    🛍️ Proceed to Rent / Book
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================== CHECKOUT MODAL WITH DAMAGE AGREEMENT ================== */}
        {isCheckoutOpen && selectedProduct && (
          <div className="modal-overlay" onClick={() => setIsCheckoutOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <button className="btn-secondary" style={{ padding: '3px 10px', fontSize: '0.85rem' }} onClick={() => setIsCheckoutOpen(false)}>← Back</button>
                <h3 style={{ color: '#be185d', margin: 0 }}>Rental Confirmation</h3>
                <span></span>
              </div>

              {/* Delivery / Pickup Choice */}
              <div style={{ background: '#fdf2f8', padding: '10px', borderRadius: '14px', marginBottom: '1rem' }}>
                <label style={{ fontWeight: 800, fontSize: '0.85rem', color: '#be185d', display: 'block', marginBottom: '6px' }}>Collection Mode</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" onClick={() => setDeliveryMethod('self-pickup')} style={{ flex: 1, padding: '8px', borderRadius: '10px', border: '1.5px solid', borderColor: deliveryMethod === 'self-pickup' ? '#db2777' : '#e5e7eb', background: deliveryMethod === 'self-pickup' ? '#fff' : '#f9fafb', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                    🏪 Self-Pickup (Free)
                  </button>
                  <button type="button" onClick={() => setDeliveryMethod('delivery')} style={{ flex: 1, padding: '8px', borderRadius: '10px', border: '1.5px solid', borderColor: deliveryMethod === 'delivery' ? '#db2777' : '#e5e7eb', background: deliveryMethod === 'delivery' ? '#fff' : '#f9fafb', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}>
                    🚚 Courier (+₹150)
                  </button>
                </div>
              </div>

              {/* Owner Care & Damage Agreement */}
              <div style={{ background: '#fff', border: '1.5px solid #fbcfe8', borderRadius: '14px', padding: '12px', marginBottom: '1rem' }}>
                <h4 style={{ color: '#be185d', fontSize: '0.85rem', margin: '0 0 4px' }}>🛡️ Garment Care & Damage Policy</h4>
                <ul style={{ fontSize: '0.75rem', color: '#4b5563', paddingLeft: '16px', margin: '4px 0' }}>
                  <li>Dry cleaned & sanitized. Do not spray perfumes directly on zari/embroidery.</li>
                  <li>Minor stains: Dry-cleaning fee will be adjusted from deposit after inspection.</li>
                  <li>Damage protection: Full deposit will be released only after owner inspection.</li>
                </ul>

                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '0.8rem', fontWeight: 700, color: '#1f161a', cursor: 'pointer' }}>
                  <input type="checkbox" checked={agreedToTerms} onChange={(e) => setAgreedToTerms(e.target.checked)} />
                  I agree to return garment in neat condition and adhere to damage policies.
                </label>
              </div>

              {/* Price Calculation */}
              <div style={{ background: '#fff', border: '1px solid #fce7f0', borderRadius: '14px', padding: '1rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>Rental ({rentDays} Days):</span>
                  <span>₹{selectedProduct.rentalPricePerDay * rentDays}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '4px' }}>
                  <span>Refundable Security Deposit:</span>
                  <span>₹{selectedProduct.securityDeposit || 0}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 900, color: '#db2777', borderTop: '1px dashed #fce7f0', paddingTop: '6px' }}>
                  <span>Total Payable:</span>
                  <span>₹{(selectedProduct.rentalPricePerDay * rentDays) + (selectedProduct.securityDeposit || 0) + (deliveryMethod === 'delivery' ? 150 : 0)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button className="btn-secondary" onClick={() => setIsCheckoutOpen(false)}>Cancel</button>
                <button className="btn-primary" onClick={handleConfirmOrder}>Confirm Rental Booking</button>
              </div>
            </div>
          </div>
        )}

        {/* ================== OWNER DAMAGE REPORTING MODAL ================== */}
        {inspectingOrder && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '460px' }}>
              <h3 style={{ color: '#b91c1c', margin: '0 0 8px' }}>⚠️ Report Garment Damage</h3>
              <p style={{ fontSize: '0.8rem', color: '#705b64', marginBottom: '12px' }}>
                Order #{inspectingOrder.id}. An alert message will be sent to customer with reason & deduction proof.
              </p>

              <div className="form-group">
                <label>Damage Reason & Inspection Notes</label>
                <textarea 
                  rows="3" 
                  placeholder="e.g. Minor tear near dupatta border / Food stain requiring deep dry clean"
                  value={damageReason}
                  onChange={(e) => setDamageReason(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Deduction / Repair Fee (₹)</label>
                <input 
                  type="number" 
                  placeholder="e.g. 500" 
                  value={damageFee}
                  onChange={(e) => setDamageFee(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1rem' }}>
                <button className="btn-secondary" onClick={() => setInspectingOrder(null)}>Cancel</button>
                <button className="btn-primary" style={{ background: '#b91c1c' }} onClick={() => handleReportDamage(inspectingOrder)}>
                  Submit Inspection Report
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ================== LIST ITEM MODAL ================== */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content" style={{ maxWidth: '580px', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <button className="btn-secondary" style={{ padding: '3px 10px', fontSize: '0.85rem' }} onClick={() => setIsModalOpen(false)}>← Back</button>
                <h3 style={{ margin: 0, color: '#be185d' }}>List Outfit for Rent</h3>
                <span></span>
              </div>

              <form onSubmit={handleAddItem}>
                <div className="form-group">
                  <label>Outfit Photo (Camera / Upload)</label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <button type="button" className="btn-secondary" onClick={startCamera}>📷 Open Camera</button>
                    <label className="btn-secondary" style={{ cursor: 'pointer' }}>
                      📁 Choose Photo
                      <input type="file" accept="image/*" onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setCapturedImage(reader.result);
                            setNewItem(prev => ({ ...prev, imageUrl: reader.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }} style={{ display: 'none' }} />
                    </label>
                  </div>

                  {isCameraActive && (
                    <div style={{ background: '#fff5f8', padding: '10px', borderRadius: '12px', textAlign: 'center', marginBottom: '8px' }}>
                      <video ref={videoRef} autoPlay playsInline style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', borderRadius: '8px' }} />
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '8px' }}>
                        <button type="button" className="btn-primary" onClick={capturePhoto}>📸 Snap Photo</button>
                        <button type="button" className="btn-secondary" onClick={stopCamera}>Cancel</button>
                      </div>
                    </div>
                  )}
                  <canvas ref={canvasRef} style={{ display: 'none' }} />

                  {capturedImage && (
                    <div style={{ textAlign: 'center', marginTop: '8px' }}>
                      <img src={capturedImage} alt="Preview" style={{ width: '100%', maxHeight: '160px', objectFit: 'contain', borderRadius: '8px' }} />
                      <button type="button" onClick={() => { setCapturedImage(null); setNewItem(prev => ({ ...prev, imageUrl: '' })); }} style={{ background: '#fee2e2', color: '#b91c1c', border: 'none', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', marginTop: '6px' }}>
                        🗑️ Retake Photo
                      </button>
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>Title</label>
                  <input type="text" required placeholder="e.g. Heavy Velvet Bridal Lehenga" value={newItem.title} onChange={(e) => setNewItem({ ...newItem, title: e.target.value })} />
                </div>

                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Category</label>
                    <select value={newItem.category} onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}>
                      <option value="Dresses">Dresses</option>
                      <option value="Jewellery">Jewellery</option>
                      <option value="Accessories">Accessories</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Sizes</label>
                    <input type="text" placeholder="e.g. S, M, L" value={newItem.sizes} onChange={(e) => setNewItem({ ...newItem, sizes: e.target.value })} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Rent / Day (₹)</label>
                    <input type="number" required placeholder="1999" value={newItem.rentalPricePerDay} onChange={(e) => setNewItem({ ...newItem, rentalPricePerDay: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Deposit (₹)</label>
                    <input type="number" required placeholder="4000" value={newItem.securityDeposit} onChange={(e) => setNewItem({ ...newItem, securityDeposit: e.target.value })} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Occupied / Booked Calendar Dates</label>
                  <input type="text" placeholder="e.g. 15 Oct - 18 Oct 2026 (or Available Now)" value={newItem.bookedDates} onChange={(e) => setNewItem({ ...newItem, bookedDates: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Pickup Address (Complete Flat / Area)</label>
                  <input type="text" required placeholder="Flat 204, Road 12, Banjara Hills, Hyderabad" value={newItem.pickupAddress} onChange={(e) => setNewItem({ ...newItem, pickupAddress: e.target.value })} />
                </div>

                <div style={{ display: 'flex', gap: '0.8rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>City</label>
                    <input type="text" required value={newItem.city} onChange={(e) => setNewItem({ ...newItem, city: e.target.value })} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label>Owner WhatsApp / Contact</label>
                    <input type="text" required placeholder="9876543210" value={newItem.ownerPhone} onChange={(e) => setNewItem({ ...newItem, ownerPhone: e.target.value })} />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '1rem' }}>
                  <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Publishing...' : 'Publish Listing'}</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;