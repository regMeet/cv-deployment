# Rectangle Intersection

**Origin:** Personal &nbsp;|&nbsp; **Topics:** Misc

*Source:* `alan/newest/rectangleIntersection.java`

## Problem

http://silentmatt.com/rectangle-intersection/
 A.X1 < B.X2: true
 A.X2 > B.X1: true
 A.Y1 < B.Y2: true
 A.Y2 > B.Y1: true
 Intersect: true

 http://stackoverflow.com/questions/306316/determine-if-two-rectangles-overlap -each-other

 Cond1. If A's left edge is to the right of the B's right edge, - then A is Totally to right Of B
 Cond2. If A's right edge is to the left of the B's left edge, - then A is Totally to left Of B
 Cond3. If A's top edge is below B's bottom edge, - then A is Totally below B
 Cond4. If A's bottom edge is above B's top edge, - then A is Totally above B

## Solution

```java
public class rectangleIntersection {

	public static int area(int K, int L, int M, int N, int P, int Q, int R, int S) {
		int left = Math.max(K, P);
		int bottom = Math.max(L, Q);
		int right = Math.min(M, R);
		int top = Math.min(N, S);

		if (left < right && bottom < top) {
			int intersection = (right - left) * (top - bottom);
			// int areaRectangle1 = (M - K) * (N - L);
			// int areaRectangle2 = (R - P) * (S - Q);
			// int unionArea = areaRectangle1 + areaRectangle2 - interSection;
			return intersection;
		}
		return 0;
	}

	/**
	 * x1 botton left y2 botton right
	 *
	 * x2 top left y2 top right
	 */
	public static int area2(int ax1, int ay1, int ax2, int ay2, int bx1, int by1, int bx2, int by2) {
		int cx1 = Math.max(ax1, bx1);
		int cy1 = Math.max(ay1, by1);
		int cx2 = Math.min(ax2, bx2);
		int cy2 = Math.min(ay2, by2);

		if (cx1 < cx2 && cy1 < cy2) {
			int areaRectangleC = (cx2 - cx1) * (cy2 - cy1);
			return areaRectangleC;
		}
		return 0;
	}

	public static void main(String[] args) {
		// solution(K, L, M, N, P, Q, R, S);
		System.out.println(area2(0, 2, 5, 10, 3, 1, 20, 15));
	}

}
```
