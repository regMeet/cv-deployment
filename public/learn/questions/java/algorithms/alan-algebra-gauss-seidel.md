# Gauss Seidel

**Origin:** Math Practice &nbsp;|&nbsp; **Topics:** Arrays

*Source:* `alan/algebra/Gauss_Seidel.java`

## Solution

```java
//This class provides a simple implementation of the GaussSeidel method for solving systems of linear equations.
//If the matrix isn't diagonally dominant the program tries to convert it(if possible) by rearranging the rows.

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Gauss_Seidel {
    public static final int MAX_ITERATIONS = 100;
    // double epsilon = 1e-15;
    double epsilon = 0.0005;

    private double[][] M;

    public Gauss_Seidel(double[][] matrix) {
        M = matrix;
    }

    public void print() {
        int n = M.length;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n + 1; j++)
                System.out.print(M[i][j] + " ");
            System.out.println();
        }
    }

    public void solve() {
        int iterations = 0;
        int n = M.length;

        double[] X = new double[n]; // Approximations
        double[] P = new double[n]; // Prev
        Arrays.fill(X, 0);

        while (true) {
            for (int i = 0; i < n; i++) {
                double sum = M[i][n]; // b_n

                for (int j = 0; j < n; j++)
                    if (j != i)
                        sum -= M[i][j] * X[j];

                // Update x_i to use in the next row calculation
                X[i] = 1 / M[i][i] * sum;
            }

            System.out.print("X_" + iterations + " = {");
            for (int i = 0; i < n; i++)
                System.out.print(X[i] + " ");
            System.out.println("}");

            iterations++;
            if (iterations == 1)
                continue;

            boolean stop = true;
            for (int i = 0; i < n && stop; i++)
                if (Math.abs(X[i] - P[i]) > epsilon)
                    stop = false;

            if (stop || iterations == MAX_ITERATIONS)
                break;
            P = (double[]) X.clone();
        }
    }

    public static void main(String[] args) throws IOException {
        int n;
        double[][] M;

        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        PrintWriter writer = new PrintWriter(System.out, true);

        System.out.println("Enter the number of variables in the equation:");
        n = Integer.parseInt(reader.readLine());
        M = new double[n][n + 1];
        System.out.println("Enter the augmented matrix:");

        for (int i = 0; i < n; i++) {
            StringTokenizer strtk = new StringTokenizer(reader.readLine());

            while (strtk.hasMoreTokens())
                for (int j = 0; j < n + 1 && strtk.hasMoreTokens(); j++)
                    M[i][j] = Float.parseFloat(strtk.nextToken());
        }

        Gauss_Seidel gausSeidel = new Gauss_Seidel(M);

        writer.println();
        gausSeidel.print();
        gausSeidel.solve();
    }
}
```
