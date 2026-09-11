# DESIGN.md — Product Management Web

## 1. Design Direction

ออกแบบเว็บ **Product Management** ให้มีภาพลักษณ์แบบ:

> **Dark / Liquid Glass / Glassmorphism / Metallic / Immersive Motion**

Mood หลักต้องดู **premium, futuristic, cinematic, clean และใช้งานจริงได้**  
ไม่ควรดูเป็น cyberpunk ที่มีสี neon มากเกินไป และไม่ควรใส่ effect จนรบกวนการอ่านข้อมูลสินค้า

### Keywords

- Dark Theme
- Liquid Glass
- Glass UI
- Glassmorphism
- Metallic Surface
- Soft Chrome
- Fluid Motion
- Brush Reveal
- Fluid Text
- Marquee
- Product Carousel
- Scroll Depth
- Cinematic UI
- Premium Dashboard

---

# 2. Core Visual Language

## Main Background

สีพื้นหลังหลัก:

```css
--bg-primary: #0C0C0C;
```

พื้นหลังต้องไม่ดำสนิทแบบ `#000000` เพื่อให้ Glass Layer และ Metallic Highlight มีมิติ

ใช้ gradient แบบ subtle ได้ เช่น:

```css
background:
  radial-gradient(
    circle at 20% 10%,
    rgba(255,255,255,0.055),
    transparent 28%
  ),
  radial-gradient(
    circle at 80% 35%,
    rgba(120,130,255,0.05),
    transparent 32%
  ),
  #0C0C0C;
```

ห้ามใช้ gradient สีสดมากเกินไป

---

# 3. Color System

## Core Colors

```css
--background: #0C0C0C;

--surface: rgba(255, 255, 255, 0.045);
--surface-hover: rgba(255, 255, 255, 0.075);
--surface-active: rgba(255, 255, 255, 0.10);

--glass-border: rgba(255, 255, 255, 0.10);
--glass-border-hover: rgba(255, 255, 255, 0.18);

--text-primary: #F5F5F5;
--text-secondary: #A9A9AF;
--text-muted: #707078;

--metal-light: #E5E7EB;
--metal-mid: #9CA3AF;
--metal-dark: #3F3F46;

--accent: #D8DCFF;
--accent-soft: rgba(216, 220, 255, 0.12);

--success: #73E2A7;
--warning: #F6C96B;
--danger: #FF7272;
--info: #81B5FF;
```

Accent ต้องใช้แบบ restraint  
ห้ามใช้หลาย accent color แข่งกันในหน้าเดียว

---

# 4. Glass Material

Card หลักทั้งหมดใช้แนว **Liquid Glass**

ตัวอย่าง:

```css
.glass-panel {
  background: rgba(255, 255, 255, 0.045);

  backdrop-filter: blur(22px) saturate(135%);
  -webkit-backdrop-filter: blur(22px) saturate(135%);

  border: 1px solid rgba(255, 255, 255, 0.10);

  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.08),
    0 20px 60px rgba(0,0,0,0.35);
}
```

## Glass Card Rules

- Border Radius: `20px - 28px`
- Background ต้องโปร่งใส
- Blur ประมาณ `16px - 28px`
- ใช้ inner highlight บาง ๆ ด้านบน
- Shadow ต้องนุ่มและมืด
- ห้ามใช้ white border หนา
- Hover สามารถเพิ่ม opacity + highlight เล็กน้อย
- Glass ต้องยังอ่าน text ได้ชัด

---

# 5. Metallic Language

ใช้ Metallic เป็น **accent material** ไม่ใช่ทุก component

เหมาะกับ:

- Logo mark
- Primary CTA
- Icon container
- Number / statistics
- Selected navigation
- Product badge
- Decorative orb / shape

Metallic gradient:

```css
background: linear-gradient(
  135deg,
  #F4F4F5 0%,
  #9CA3AF 28%,
  #F5F5F5 48%,
  #71717A 70%,
  #E4E4E7 100%
);
```

สามารถใช้ animated light sweep บน metallic surface ได้ แต่ต้อง subtle

---

# 6. Typography

Typography ต้อง clean และ modern

ภาษาไทยแนะนำ:

- Kanit
- IBM Plex Sans Thai
- Noto Sans Thai

ภาษาอังกฤษ:

- Inter
- Geist
- Manrope

ถ้า project ปัจจุบันใช้ **Kanit** อยู่แล้ว ให้ใช้ต่อเพื่อไม่เพิ่ม dependency โดยไม่จำเป็น

## Typography Scale

```text
Display / Hero     64–88px desktop
Page Heading       42–56px
Section Heading    28–36px
Card Heading       18–22px
Body               15–17px
Small              13–14px
Caption             11–12px
```

Mobile ให้ scale ลงอย่างเหมาะสมด้วย `clamp()`

ตัวอย่าง:

```css
font-size: clamp(2.8rem, 7vw, 5.5rem);
```

---

# 7. Main Navigation

Navbar เป็น floating glass navbar

Desktop:

```text
┌─────────────────────────────────────────────────────────────┐
│ ◉ PRODUCT OS          Home   Products   Manage      [ + ] │
└─────────────────────────────────────────────────────────────┘
```

Style:

- Floating
- `position: sticky` หรือ fixed
- Glass background
- Blur สูง
- Radius 999px หรือ 20px
- มี margin จาก viewport
- border thin metallic/glass
- nav active มี liquid pill

Mobile:

- Compact logo
- Menu button
- Navigation เปิดเป็น glass sheet/dropdown
- อย่าทำ navbar สูงเกินไป

---

# 8. Home Page

Route:

```text
/
```

Home ต้องเป็น **landing + product overview** ไม่ใช่ dashboard แข็ง ๆ

---

## 8.1 Hero Section

Hero มีความ cinematic และ immersive

Layout:

```text
                     PRODUCT MANAGEMENT
             Organize products beautifully.

       Manage inventory with a fast, fluid interface.

                 [ Manage Products → ]


                 subtle 3D glass object
```

### Background

ใช้:

- soft radial light
- glass orb
- metallic sphere / ring
- subtle grid/noise
- blurred reflections

ห้ามใช้ image stock ที่ไม่เกี่ยวข้อง

สามารถมี scroll-driven parallax เล็กน้อย:

- foreground = move faster
- background orb = move slower
- Hero title = slight scale + fade
- ห้ามทำ motion รุนแรง

---

# 9. Hero Text Animation

## Brush Reveal

Hero heading ใช้ **Brush Reveal**

Concept:

ข้อความค่อย ๆ ถูกเปิดเผยเหมือน brush sweep ผ่านตัวอักษร

แนะนำ implement ด้วย:

- CSS Mask
- SVG mask
- clip-path
- GSAP animation

Animation:

```text
Hidden
↓
Brush mask moves left → right
↓
Text revealed
↓
Very subtle shine
```

Duration:

```text
0.8s – 1.4s
```

ไม่ควร loop

---

# 10. Fluid Text Animation

ข้อความรองใช้ Fluid Text

Effect:

```text
blur
+
slight vertical displacement
+
opacity
+
character / word stagger
```

ตัวอย่าง:

```text
blur(10px) → blur(0)
translateY(18px) → 0
opacity 0 → 1
```

ใช้กับ:

- Hero subtitle
- Section heading
- Statistics
- Empty state title

ไม่ใช้กับ table row ทุกแถว เพราะจะรบกวน UX

---

# 11. Marquee

ใช้ marquee เป็น transition ระหว่าง Hero และ Product Section

ตัวอย่าง:

```text
PRODUCTS ✦ INVENTORY ✦ MANAGE ✦ CREATE ✦ UPDATE ✦ CONTROL ✦
```

Style:

- uppercase
- tracking กว้าง
- text สี muted metallic
- glass horizontal container
- seamless infinite loop
- slow motion

Animation speed:

```text
25 – 45 seconds / loop
```

ต้อง pause/reduce animation เมื่อ `prefers-reduced-motion`

---

# 12. Product Showcase Carousel

Home page ต้องมี **Product Carousel**

Section:

```text
Featured Products

             ┌──────────────┐
       ┌─────┤ Product 02   ├─────┐
       │     │              │     │
Product 01   │  ACTIVE CARD │ Product 03
       │     │              │     │
       └─────┤              ├─────┘
             └──────────────┘
```

## Carousel Behavior

Desktop:

- Center focused carousel
- center card ใหญ่กว่า card ข้าง ๆ
- card ข้าง ๆ opacity ลดลง
- slight perspective
- Drag / swipe ได้
- Mouse wheel ไม่ควรถูก hijack
- Arrow navigation
- Dots / progress indicator

Mobile:

- 1 main card
- เห็น card ถัดไปประมาณ 10–15%
- swipe ได้

---

# 13. Product Card

Product card ต้องเป็น Liquid Glass

โครงสร้าง:

```text
┌────────────────────────────┐
│  #001              IN STOCK│
│                            │
│       PRODUCT VISUAL       │
│                            │
│  MacBook Pro              │
│  ฿59,900                  │
│                            │
│  Stock                    │
│  14 units                 │
│                            │
│            View Product → │
└────────────────────────────┘
```

## Product Card Style

- glass transparent
- border soft
- metallic header number
- product name white
- price metallic / accent
- stock badge theme controlled
- hover card floats `translateY(-4px)`
- subtle highlight follows pointer optional

Do not:

- rotate card มากเกิน
- glow แรง
- animation ยาว
- card มี text แน่นเกินไป

---

# 14. Manage Product Page

Route:

```text
/manage-products
```

หน้า Manage Products ต้องเน้น usability มากกว่า animation

Layout:

```text
[ Page Header ]

[ Product Form / Editing Panel ]

[ Search / filters / inventory status ]

[ Product Table / Product List ]
```

---

# 15. Manage Product Header

ใช้ glass card แบบ horizontal

```text
┌─────────────────────────────────────────────────────────────┐
│ Product Management                          24 Products    │
│ Add, update and organize your inventory.                  │
└─────────────────────────────────────────────────────────────┘
```

Heading ใช้ fluid reveal เล็กน้อยเมื่อ page load

ห้ามใช้ marquee ในหน้า manage หลัก

---

# 16. Product Form

Create / Update form เป็น glass panel

Desktop:

```text
Product Name       Price        Quantity        [ Add Product ]
```

Edit Mode:

```text
Product Name       Price        Quantity       [ Save ] [Cancel]
```

Input Style:

```css
background: rgba(255,255,255,0.035);
border: 1px solid rgba(255,255,255,0.10);
```

Focus:

```css
border-color: rgba(216,220,255,0.55);
box-shadow: 0 0 0 3px rgba(216,220,255,0.08);
```

Inputs ต้องอ่านง่ายและ contrast ผ่าน

---

# 17. Buttons

## Primary

Liquid metallic button

```text
Add Product →
```

Style:

- dark metallic
- top gloss
- thin border
- pointer highlight
- scale `1.01` hover
- scale `0.98` active

## Secondary

Glass Button

## Danger

ใช้ danger accent แบบ muted

ห้ามทำปุ่ม delete เป็นพื้นแดงสดตลอดเวลา

ให้ default เป็น:

```text
glass + danger icon
```

hover ค่อยแสดง danger surface

---

# 18. Product Table

Desktop ใช้ table ที่อ่านข้อมูลเร็ว

Container:

- Liquid Glass Card
- sticky header optional
- row separators subtle
- hover row highlight
- no zebra stripe แบบแรง

Columns:

```text
ID | Product | Price | Quantity | Status | Actions
```

Quantity state:

```text
0      → Out of stock
1–5    → Low stock
6+     → In stock
```

Status Badge:

```text
Out of stock → muted red glass
Low stock    → amber glass
In stock     → green glass
```

---

# 19. Mobile Product List

บน mobile ไม่ควรบีบ table จนอ่านยาก

Breakpoint เล็กให้เปลี่ยนเป็น cards:

```text
┌──────────────────────────────┐
│ #12            ● In Stock   │
│ Wireless Mouse              │
│ ฿890                        │
│                              │
│ Quantity             12      │
│                              │
│             Edit   Delete   │
└──────────────────────────────┘
```

Desktop = table  
Mobile = compact cards

---

# 20. Error Alert Design

Error Alert ทุกชนิดต้องคุม Theme

ห้ามใช้ alert แบบแดง solid ที่หลุดจาก Liquid Glass UI

## Error

```css
background: rgba(255, 90, 90, 0.08);
border: 1px solid rgba(255, 114, 114, 0.20);
backdrop-filter: blur(18px);
```

Structure:

```text
┌──────────────────────────────────────────────┐
│ ⓧ  ไม่สามารถเพิ่มสินค้าได้             ×   │
│    กรุณาตรวจสอบข้อมูลแล้วลองอีกครั้ง       │
└──────────────────────────────────────────────┘
```

Entry animation:

```text
opacity 0 → 1
translateY(-8px) → 0
blur(4px) → 0
```

Exit:

```text
opacity → 0
translateY(-5px)
scale 0.985
```

---

# 21. Alert Variants

ทั้งหมดต้องใช้ glass surface เดียวกัน

## Success

```text
green tint + glass
```

## Warning

```text
amber tint + glass
```

## Error

```text
red tint + glass
```

## Info

```text
blue tint + glass
```

Color ใช้เฉพาะ:

- icon
- border tint
- tiny glow
- keyword

ไม่ใช้ solid background เต็ม card

---

# 22. Toast

สำหรับ:

- Product created
- Product updated
- Product deleted

ใช้ Toast Glass

ตำแหน่ง:

```text
desktop → bottom-right
mobile  → bottom-center
```

ตัวอย่าง:

```text
✓ Product added successfully
```

Auto dismiss:

```text
2.5 – 4 seconds
```

Error สำคัญไม่ควร auto dismiss เร็วเกินไป

---

# 23. Delete Confirmation

อย่าใช้ `window.confirm()` ใน final polished UI

สร้าง Glass Dialog:

```text
             Delete product?

     Wireless Mouse will be removed.
     This action cannot be undone.

            [Cancel] [Delete]
```

Backdrop:

```css
background: rgba(0,0,0,0.55);
backdrop-filter: blur(10px);
```

Dialog:

- Liquid glass
- danger icon
- Delete button muted red
- keyboard accessible
- Escape closes dialog
- focus trap

---

# 24. Loading State

ใช้ loading ที่เข้ากับ theme

## Page Loading

- metallic spinner
- subtle fluid loader

## Product Loading

ใช้ skeleton glass:

```text
[██████████ ]
[██████     ]
[████████   ]
```

Skeleton ต้อง shimmer ช้า

ห้าม flash ขาวแรง

---

# 25. Empty State

ตัวอย่าง:

```text
              ◇

       No products yet.

Create your first product to start
building your inventory.

        [ + Add Product ]
```

ใช้ icon metallic / glass

มี fluid text reveal เบา ๆ

---

# 26. Scroll Motion

ใช้ Scroll Animation อย่างมี hierarchy

## Home

อนุญาต motion มากที่สุด:

- hero depth
- parallax
- section reveal
- carousel
- marquee
- subtle zoom

## Manage Product

motion ต่ำกว่า Home:

- fade-up
- small blur reveal
- row transition
- alert transition

ห้ามทำ CRUD screen เคลื่อนตาม scroll จนใช้งานยาก

---

# 27. Immersive Depth Effect

Home สามารถใช้ subtle scroll depth

Concept:

เมื่อ scroll:

```text
Hero background:
scale 1 → 1.12

Hero glass orb:
translateZ-like visual

Hero title:
scale 1 → 0.92
opacity 1 → 0

Next section:
moves forward visually
```

สามารถสร้างด้วย:

- GSAP ScrollTrigger
- CSS transform
- Framer Motion / Motion
- IntersectionObserver

ไม่จำเป็นต้องใช้ Three.js หากไม่มี 3D model จริง

Performance สำคัญกว่า effect

---

# 28. Animation Timing

ใช้ motion curve:

```css
cubic-bezier(0.16, 1, 0.3, 1)
```

Typical durations:

```text
micro interaction  150–250ms
button              180–220ms
card                250–400ms
section reveal      500–800ms
brush reveal        800–1400ms
page intro          700–1200ms
```

ห้ามทุก component animate พร้อมกัน

---

# 29. Reduced Motion

ต้องรองรับ:

```css
@media (prefers-reduced-motion: reduce)
```

เมื่อเปิด Reduce Motion:

- ปิด parallax
- ปิด continuous decorative animation
- marquee หยุดหรือแสดง static
- brush reveal เปลี่ยนเป็น simple fade
- carousel ยังใช้งานได้ด้วย control

---

# 30. Interaction Rules

## Hover

Card:

```text
border brighten
translateY(-3px)
shadow slightly stronger
```

Button:

```text
highlight sweep
```

Icon:

```text
scale 1 → 1.05
```

## Click

```text
scale .98
```

## Focus

ต้องมี visible keyboard focus เสมอ

---

# 31. Background Decoration

ใช้ decorative elements แบบ restrained:

- blurred glass orb
- metallic ring
- fine noise texture
- thin grid
- soft reflective line
- very subtle glow

ไม่ควรใช้:

- particle เยอะ
- stars เยอะ
- neon grid
- random floating icons
- purple gradient แบบ template AI ทั่วไป

Design ต้องดู intentional ไม่ใช่ AI-generated dashboard template

---

# 32. Optional Cursor Light

Desktop สามารถเพิ่ม ambient pointer light:

```css
radial-gradient(
  300px circle at var(--mouse-x) var(--mouse-y),
  rgba(255,255,255,0.045),
  transparent 70%
)
```

ใช้เฉพาะ background / large panels

ห้ามทำ cursor custom ที่รบกวน usability

Mobile ต้อง disable

---

# 33. Spacing

ใช้ spacing system consistent:

```text
4
8
12
16
20
24
32
40
48
64
80
96
```

Container:

```text
max-width: 1200–1320px
```

Desktop horizontal padding:

```text
32–48px
```

Mobile:

```text
16–20px
```

---

# 34. Border Radius

```text
Input       12–16px
Button      12–16px
Card        20–28px
Large Hero  28–36px
Pill        999px
```

---

# 35. Iconography

ใช้ `lucide-react`

Icon style:

- stroke 1.5–2
- monochrome
- white / muted / semantic color
- ห้ามใช้ icon หลาย style ปนกัน

Recommended:

```text
Package
PackageSearch
Plus
Pencil
Trash2
ArrowRight
Search
Boxes
ChevronLeft
ChevronRight
X
CircleAlert
CircleCheck
TriangleAlert
```

---

# 36. Recommended Page Structure

```text
src/
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── PageContainer.jsx
│   │
│   ├── ui/
│   │   ├── GlassCard.jsx
│   │   ├── GlassButton.jsx
│   │   ├── Alert.jsx
│   │   ├── Toast.jsx
│   │   └── ConfirmDialog.jsx
│   │
│   ├── motion/
│   │   ├── BrushReveal.jsx
│   │   ├── FluidText.jsx
│   │   └── Marquee.jsx
│   │
│   └── product/
│       ├── ProductCarousel.jsx
│       ├── ProductCard.jsx
│       ├── ProductForm.jsx
│       ├── ProductTable.jsx
│       └── ProductMobileCard.jsx
│
├── pages/
│   ├── Home.jsx
│   └── ManageProduct.jsx
│
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

ไม่จำเป็นต้องแยกทุก component ทันที  
ให้ refactor เฉพาะเมื่อช่วยลดความซ้ำและทำให้ maintain ง่ายขึ้น

---

# 37. Existing Functional Requirements

ต้องรักษาระบบเดิม:

```text
GET    /products
POST   /products
PUT    /products/:id
DELETE /products/:id
```

Product fields:

```text
id
name
price
quantity
```

Design changes ห้ามทำให้ CRUD เดิมเสีย

---

# 38. Home Page Content Blueprint

```text
NAVBAR

HERO
├── Eyebrow: PRODUCT MANAGEMENT SYSTEM
├── Main headline
├── Supporting text
├── Manage Products CTA
└── Decorative liquid glass visual

MARQUEE

FEATURED PRODUCTS
├── Heading
├── Product Carousel
└── Carousel controls

INVENTORY OVERVIEW
├── Total products
├── Total units
├── Low stock
└── Out of stock

CTA
└── Open Product Manager

FOOTER
```

---

# 39. Manage Products Blueprint

```text
NAVBAR

PAGE HEADER
├── Product Management
├── Supporting text
└── Product count

PRODUCT FORM
├── Name
├── Price
├── Quantity
└── Create / Update Action

ALERT / TOAST

PRODUCT INVENTORY
├── Header
├── Count
├── optional search
└── Table Desktop / Cards Mobile

CONFIRM DIALOG
```

---

# 40. Example Homepage Copy

Eyebrow:

```text
PRODUCT MANAGEMENT SYSTEM
```

Headline:

```text
Manage products.
Beautifully.
```

หรือ:

```text
Inventory,
in motion.
```

Supporting:

```text
A focused workspace for organizing products,
pricing and inventory in one fluid experience.
```

CTA:

```text
Manage Products →
```

Marquee:

```text
PRODUCTS ✦ INVENTORY ✦ CREATE ✦ UPDATE ✦ ORGANIZE ✦ CONTROL ✦
```

---

# 41. UX Priority

ลำดับความสำคัญ:

```text
1. Usability
2. Readability
3. Performance
4. Visual polish
5. Animation
```

ถ้า animation ขัดกับ CRUD หรือ readability ให้ลด animation

---

# 42. Performance Rules

- ใช้ CSS transform + opacity เป็นหลัก
- หลีกเลี่ยง animate `width`, `height`, `top`, `left`
- อย่า blur layer ขนาดใหญ่หลายสิบชั้น
- จำกัด backdrop-filter
- Lazy load component หนักถ้ามี
- อย่าเพิ่ม Three.js ถ้าไม่ได้ใช้ 3D จริง
- Carousel ต้อง smooth บน mobile
- animation ต้องไม่ทำให้ input lag

Target:

```text
60fps interaction where practical
```

---

# 43. Accessibility

ต้องมี:

- contrast อ่านได้
- keyboard navigation
- focus-visible
- form label
- aria-label สำหรับ icon-only buttons
- dialog focus management
- semantic status for alerts
- reduced motion
- ไม่สื่อสถานะด้วยสีอย่างเดียว

ตัวอย่าง stock status ต้องมีทั้งสี + text:

```text
● Low stock
```

ไม่ใช่มีเพียง dot สีเหลือง

---

# 44. Responsive Rules

## Desktop ≥ 1024

- full navbar
- product carousel 3-card perspective
- table
- large hero typography

## Tablet 768–1023

- compact navbar
- carousel 2-card feel
- table scroll allowed
- reduced hero visual

## Mobile < 768

- mobile menu
- product carousel single focus card
- Product list เปลี่ยนจาก table เป็น cards
- animation ลดความซับซ้อน
- CTA full-width เมื่อเหมาะสม

---

# 45. Design Guardrails

## DO

- Dark cinematic UI
- transparent glass cards
- blur อย่างมี hierarchy
- metallic highlight
- lots of breathing room
- subtle depth
- fluid motion
- consistent semantic alerts
- responsive
- readable

## DON'T

- cyberpunk neon
- rainbow gradients
- excessive glow
- glass ทุก element จน hierarchy หาย
- text contrast ต่ำ
- animated table ทุก row ตลอดเวลา
- heavy 3D บน CRUD page
- random blobs มากเกินไป
- overly rounded ทุกอย่าง
- animation ที่ block input
- design ที่ดูเหมือน generic AI SaaS template

---

# 46. Suggested Implementation Strategy

โปรเจกต์ปัจจุบันเป็น React + Vite ให้พยายามใช้ dependency เดิมก่อน

สำหรับ motion:

### Preferred

```text
CSS animations
IntersectionObserver
React state
```

### ถ้าต้องการ motion ขั้นสูง

สามารถเพิ่ม:

```text
GSAP + ScrollTrigger
```

เหมาะกับ:

- Brush Reveal
- Scroll Depth
- Hero transition
- advanced marquee

หรือใช้ Motion/Framer Motion หาก project มีอยู่แล้ว

อย่าเพิ่มทั้ง GSAP และ Framer Motion ถ้าไม่จำเป็น

---

# 47. Implementation Order

ให้ดำเนินงานตามลำดับนี้:

```text
1. Global dark theme
2. Background
3. Navbar
4. Shared Glass Card / Button
5. Home Hero
6. Brush Reveal
7. Fluid Text
8. Marquee
9. Product Carousel
10. Manage Product glass redesign
11. Table / Mobile Cards
12. Alerts / Toast
13. Delete Dialog
14. Loading / Empty states
15. Responsive
16. Accessibility
17. Motion polish
18. Performance test
```

---

# 48. Acceptance Criteria

Design ถือว่าสำเร็จเมื่อ:

- Background หลักเป็น `#0C0C0C`
- เว็บเป็น Dark Theme จริง
- Glass UI โปร่งใสและอ่านง่าย
- Card มี glassmorphism ที่ consistent
- มี Liquid Glass language
- Metallic ใช้เป็น accent อย่างมี restraint
- Navbar อยู่ใน theme
- Home มี cinematic Hero
- Hero มี Brush Reveal
- Supporting text มี Fluid Text animation
- มี Marquee
- Home มี Product Carousel
- Product Carousel responsive และ swipe ได้
- Manage Product CRUD ยังทำงานครบ
- Product Table อ่านง่าย
- Mobile layout ใช้งานได้จริง
- Error / Success / Warning / Info อยู่ใน theme
- Toast อยู่ใน theme
- Delete Confirmation อยู่ใน theme
- Loading / Empty states อยู่ใน theme
- รองรับ reduced motion
- ไม่มี animation ที่ทำให้ UX แย่
- ไม่มี neon/cyberpunk over-design
- ไม่มี generic AI dashboard appearance
- `npm run build` ผ่าน
- ไม่มี runtime error ใหม่จากงาน design

---

# 49. Instruction for Codex

ก่อนแก้:

1. อ่าน project ทั้งหมด
2. ตรวจ dependencies ปัจจุบัน
3. ตรวจ CSS framework และ DaisyUI/Tailwind configuration
4. ตรวจ routing
5. ตรวจ component structure
6. ตรวจ CRUD เดิม

จากนั้น implement design นี้ **โดยรักษา functionality เดิม**

ห้าม rewrite backend ถ้าไม่จำเป็นกับ UI

ห้ามเปลี่ยน API contract

ห้ามลบ feature เดิมเพื่อให้ design ทำง่ายขึ้น

หลังแก้:

1. รัน lint ถ้ามี
2. รัน `npm run build`
3. รัน frontend
4. ตรวจ `/`
5. ตรวจ `/manage-products`
6. ตรวจ responsive
7. ตรวจ CRUD
8. ตรวจ browser console
9. สรุปไฟล์ที่แก้
10. แสดง git diff หรือ summary diff

เป้าหมายคือให้เว็บรู้สึกเหมือน **premium interactive product interface**
มากกว่า admin dashboard ทั่วไป แต่ยังต้องเร็ว อ่านง่าย และใช้งานจริงได้
