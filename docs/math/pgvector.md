# Bản chất Toán học của pgvector & Cơ chế Tìm kiếm Ngữ nghĩa không Quét bảng (No Scan Table)

Tài liệu này mô tả chi tiết nền tảng toán học đằng sau cách thức hệ thống **HypeRoom** lưu trữ tri thức chính thống, thực hiện chuyển đổi ngôn ngữ thành các biểu diễn hình học, và truy xuất chứng cứ đối chiếu tốc độ cao mà không cần quét toàn bộ cơ sở dữ liệu (Full Table Scan).

---

## 1. Biểu diễn Hình học của Văn bản (Text Embedding)

Mô hình nhúng ngôn ngữ (ví dụ: `keepitreal/vietnamese-sbert` hoặc `BGE-M3`) là một ánh xạ $f$ chuyển đổi một chuỗi văn bản thô $T$ thành một điểm (hoặc vector) nằm trong không gian thực đa chiều $\mathbb{R}^d$:

$$f(T) = \vec{v} = [x_1, x_2, x_3, \dots, x_d] \in \mathbb{R}^d$$

*Trong đó, số chiều $d$ đối với mô hình SBERT thường là $768$.*

Khi hệ thống HypeRoom xử lý:
- Bài viết từ báo chí được nhúng thành: $\vec{v}_{\text{article}} = [x_1, x_2, \dots, x_d]$
- Tuyên bố cần kiểm chứng (Claim) được nhúng thành: $\vec{v}_{\text{claim}} = [y_1, y_2, \dots, y_d]$

---

## 2. Phép đo Khoảng cách Ngữ nghĩa (Cosine Similarity)

Mức độ tương đồng về mặt nội dung/ngữ nghĩa giữa Claim và bài báo chính là **góc $\theta$** giữa hai vector này trong không gian hình học $d$ chiều. Công thức toán học tính **Cosine Similarity** được định nghĩa như sau:

$$\text{Similarity}(\vec{v}_{\text{article}}, \vec{v}_{\text{claim}}) = \cos(\theta) = \frac{\vec{v}_{\text{article}} \cdot \vec{v}_{\text{claim}}}{\|\vec{v}_{\text{article}}\| \|\vec{v}_{\text{claim}}\|} = \frac{\sum_{i=1}^d x_i y_i}{\sqrt{\sum_{i=1}^d x_i^2} \sqrt{\sum_{i=1}^d y_i^2}}$$

### Ý nghĩa toán học của điểm số:
*   $\cos(\theta) \to 1$: Góc $\theta \to 0^\circ$. Hai vector trùng hướng hoàn toàn, biểu thị hai văn bản có ngữ nghĩa tương đồng tối đa (Ví dụ: *"tăng thuế VAT"* và *"điều chỉnh thuế giá trị gia tăng"*).
*   $\cos(\theta) \to 0$: Góc $\theta \to 90^\circ$. Hai vector vuông góc, biểu thị hai nội dung không có bất kỳ mối quan hệ ngữ nghĩa nào.
*   $\cos(\theta) \to -1$: Góc $\theta \to 180^\circ$. Hai vector đối hướng, biểu thị ngữ nghĩa trái ngược hoàn toàn.

---

## 3. Tại sao tìm kiếm tuyến tính (Exact Search) gây chậm hệ thống?

Nếu không sử dụng chỉ mục chuyên dụng, khi có một Claim mới cần kiểm chứng, hệ thống bắt buộc phải tính toán độ tương đồng $\cos(\theta)$ giữa $\vec{v}_{\text{claim}}$ với **tất cả** $N$ vector bài báo hiện có trong Database.

- Độ phức tạp thời gian: $\mathcal{O}(N \times d)$
- **Hạn chế:** Khi số lượng bài báo $N$ tăng lên hàng triệu, việc chạy hàng triệu phép nhân ma trận trên đĩa cứng hoặc bộ nhớ (Full Table Scan) sẽ gây nghẽn và làm tê liệt hệ thống thời gian thực.

---

## 4. Giải pháp toán học trong pgvector: Chỉ mục ANN (Approximate Nearest Neighbor)

Để giải quyết bài toán $\mathcal{O}(N)$, `pgvector` cung cấp các thuật toán xây dựng cấu trúc chỉ mục phi tuyến tính, giúp định vị vùng chứa các vector lân cận gần nhất mà không cần kiểm tra toàn bộ bảng.

### 4.1 Chỉ mục IVFFlat (Inverted File Index) - Phân cụm K-Means

IVFFlat phân hoạch không gian đa chiều thành $K$ vùng (cụm) dựa trên thuật toán **K-Means Clustering**:

1.  **Xây dựng chỉ mục (Index Construction):**
    *   Hệ thống tự động chọn ra $K$ điểm trọng tâm (centroids) trong không gian: $\vec{c}_1, \vec{c}_2, \dots, \vec{c}_K$.
    *   Mỗi vector bài báo $\vec{v}_i$ khi lưu trữ sẽ được gán vào cụm của trọng tâm gần nó nhất:
        $$\text{Cluster}(\vec{v}_i) = \arg\min_{j} \|\vec{v}_i - \vec{c}_j\|$$
2.  **Truy vấn (Query Processing):**
    *   Khi nhận được $\vec{v}_{\text{claim}}$, hệ thống chỉ tính khoảng cách đến $K$ điểm trọng tâm ($K \ll N$).
    *   Sau khi xác định được cụm có trọng tâm gần nhất (ví dụ cụm $C_{\text{best}}$), hệ thống **chỉ quét các bài báo nằm trong cụm $C_{\text{best}}$**.
    *   Độ phức tạp giảm xuống còn $\mathcal{O}((K + \frac{N}{K}) \times d)$, giúp tốc độ truy vấn nhanh hơn gấp hàng trăm lần.

```
Không gian vector d chiều:
+-----------------------------------+
|      * (centroid 1)               |
|    .  .  . (các bài báo cụm 1)     |
|                                   |
|               x (Claim vector)    |
|                                   |
|      * (centroid 2)               |
|    o  o  o (các bài báo cụm 2)     |
+-----------------------------------+
--> Chỉ so khớp với các điểm 'o' trong cụm 2, bỏ qua cụm 1.
```

### 4.2 Chỉ mục HNSW (Hierarchical Navigable Small World)

HNSW xây dựng cấu trúc dữ liệu dưới dạng đồ thị nhiều lớp (tương tự như danh sách liên kết bỏ qua - Skip List nhưng áp dụng cho đồ thị):

1.  **Cấu trúc đồ thị phân lớp:**
    *   **Tầng cao nhất (Tầng thưa):** Chỉ chứa một số ít vector bài báo cách xa nhau làm mốc điều hướng chính.
    *   **Tầng trung gian:** Mật độ liên kết dày hơn.
    *   **Tầng đáy (Tầng 0):** Chứa toàn bộ $N$ vector bài báo được liên kết chặt chẽ với các điểm lân cận sát sườn.
2.  **Cơ chế tìm kiếm tham lam (Greedy Search on Multi-layer Graph):**
    *   Bắt đầu từ một điểm mốc ở tầng cao nhất, thuật toán tính toán tìm đỉnh đồ thị có khoảng cách Cosine ngắn nhất đến $\vec{v}_{\text{claim}}$.
    *   Từ đỉnh đó, thuật toán "nhảy" xuống tầng dưới tiếp theo để tìm kiếm cục bộ xung quanh khu vực đó.
    *   Quá trình tiếp diễn cho đến khi chạm tầng đáy để lấy ra Top-K kết quả chính xác nhất.
    *   **Độ phức tạp toán học:** $\mathcal{O}(\log N)$. Việc truy vấn lúc này chỉ là việc đi men theo các cạnh đồ thị định hướng, hoàn toàn loại bỏ việc quét bảng tuần tự.
