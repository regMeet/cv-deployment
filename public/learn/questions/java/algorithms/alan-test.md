# Test

**Origin:** Personal &nbsp;|&nbsp; **Topics:** Bit Manipulation

*Source:* `alan/test.java`

## Solution

```java
public class test {
	public static final int ONE = 1;
	public static final int ONE_2 = 2;
	public static final int TWO = (1 << 1);
	public static final int THREE = (1 << 2);
	public static final int SUCCESS = 200 | 201 | 202;

	public static void main(String[] args) {
		int N = 203;
		if ((N & ONE) != 0) {
			System.out.println("ONE");
		} else if ((N & ONE_2) != 0) {
			System.out.println("two_");
		} else if ((N & TWO) != 0) {
			System.out.println("two");
		} else if ((N & SUCCESS) != 0) {
			System.out.println("success");
		} else if ((N & THREE) != 0) {
			System.out.println("three");
		} else {
			System.out.println("other");
		}
	}

}
```
