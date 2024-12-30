package ie.atu.bookcontroller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/books")
@CrossOrigin(origins = {"http://localhost:8083", "http://localhost:8082","http://localhost:63342"})


public class BookAPIController {

    private final BookService bookService;

    public BookAPIController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/all")
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();

    }
}