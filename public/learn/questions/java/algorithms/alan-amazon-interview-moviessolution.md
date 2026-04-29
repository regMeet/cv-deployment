# Movies Solution

**Origin:** Amazon &nbsp;|&nbsp; **Topics:** Sorting

*Source:* `alan/amazon/interview/MoviesSolution.java`

## Solution

```java
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

//CLASS BEGINS, THIS CLASS IS REQUIRED
public class MoviesSolution {
    // METHOD SIGNATURE BEGINS, THIS METHOD IS REQUIRED

    // public static void main(String[] args) {
    // String[] blocks = new String[] { "5", "-2", "4", "Z", "X", "9", "+", "+" };
    // int totalScore = totalScore(blocks, 8);
    // System.out.println(totalScore);
    //
    // blocks = new String[] { "1", "2", "+", "z", null };
    // totalScore = totalScore(blocks, 8);
    // System.out.println(totalScore);
    // }

    // METHOD SIGNATURE BEGINS, THIS METHOD IS REQUIRED
    // RETURN AN EMPTY SET IF NO SIMILAR MOVIE TO THE GIVEN MOVIE IS FOUND
    // public Set<Movie> getMovieRecommendations(Movie movie, int N) {
    // HashMap<Movie, Float> allMovies = new HashMap<Movie, Float>();
    // getAllMovies(movie, allMovies);
    //
    // int size = allMovies.size();
    // if (size < N) {
    // return allMovies.keySet();
    // } else {
    // TreeMap<Movie, Float> sortedMovies = new TreeMap<>(new RatingComparator());
    // sortedMovies.putAll(allMovies);
    //
    // // return first N highest rating movies
    // int count = 0;
    // Set<Movie> hightestRelatedMovies = new HashSet<>();
    // for (Entry<Movie, Float> entry : sortedMovies.entrySet()) {
    // if (count++ < N) {
    // hightestRelatedMovies.add(entry.getKey());
    // } else {
    // break;
    // }
    // }
    // return hightestRelatedMovies;
    // }
    // }
    //
    // public void getAllMovies(Movie movie, HashMap<Movie, Float> allMovies) {
    // ArrayList<Movie> similarMovies = movie.getSimilarMovies();
    // for (Movie newMovie : similarMovies) {
    // getAllMovies(newMovie, allMovies);
    //
    // // in order this method to completely work we would need to override hashcode and equals in Movie class to compare about its id
    // if (!allMovies.containsKey(newMovie)) {
    // allMovies.put(newMovie, newMovie.getRating());
    // }
    // }
    // }

    public Set<Movie> getMovieRecommendations(Movie movie, int N) {
        List<Movie> allMovies = new ArrayList<>();

        getAllMovies(movie, allMovies);

        int size = allMovies.size();
        if (size < N) {
            return new HashSet<Movie>(allMovies);
        } else {
            Collections.sort(allMovies, new RatingComparator());

            // return first N highest rating movies
            int count = 0;
            Set<Movie> hightestRelatedMovies = new HashSet<>();
            while (count++ < N) {
                hightestRelatedMovies.add(allMovies.remove(0));
            }

            return hightestRelatedMovies;
        }
    }

    public void getAllMovies(Movie movie, List<Movie> allMovies) {
        ArrayList<Movie> similarMovies = movie.getSimilarMovies();
        for (Movie newMovie : similarMovies) {
            getAllMovies(newMovie, allMovies);

            // in order this method to completely work we would need to override hashcode and equals in Movie class to compare about its id
            if (!allMovies.contains(newMovie)) {
                allMovies.add(newMovie);
            }
        }
    }

    class RatingComparator implements Comparator<Movie> {
        @Override
        public int compare(Movie o1, Movie o2) {
            if (o1.getRating() >= o2.getRating()) {
                return -1;
            } else {
                return 1;
            }
        }
    }

    // METHOD SIGNATURE ENDS

    public static void main(String[] args) {
        Movie a = new Movie("a", 1.2f);
        Movie b = new Movie("b", 7.6f);
        Movie c = new Movie("c", 5.4f);
        Movie d = new Movie("d", 4.8f);

        c.addSimilarMovie(d);
        b.addSimilarMovie(d);
        a.addSimilarMovie(b);
        a.addSimilarMovie(c);

        MoviesSolution test = new MoviesSolution();
        Set<Movie> movieRecommendations = test.getMovieRecommendations(a, 2);
        for (Movie movie : movieRecommendations) {
            System.out.println(movie.getId() + " rating: " + movie.getRating());
        }
    }
}
```
