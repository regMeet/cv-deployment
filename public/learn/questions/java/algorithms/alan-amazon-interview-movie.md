# Movie

**Origin:** Amazon &nbsp;|&nbsp; **Topics:** Misc

*Source:* `alan/amazon/interview/Movie.java`

## Solution

```java
import java.util.ArrayList;

public class Movie {
    private String movieId;
    private float rating;
    private ArrayList<Movie> similarMovies = new ArrayList<>();

    public Movie(String movieId, float rating) {
        super();
        this.movieId = movieId;
        this.rating = rating;
    }

    public String getId() {
        return movieId;
    }

    public float getRating() {
        return rating;
    }

    public void addSimilarMovie(Movie movie) {
        similarMovies.add(movie);
    }

    public ArrayList<Movie> getSimilarMovies() {
        return similarMovies;
    }
}
```
