/*
 * package com.controller;
 *
 * import java.io.IOException;
 *
 * import javax.servlet.ServletException; import
 * javax.servlet.http.HttpServletRequest; import
 * javax.servlet.http.HttpServletResponse; import
 * javax.servlet.http.HttpSession;
 *
 * import org.springframework.web.bind.annotation.PostMapping; import
 * org.springframework.web.bind.annotation.RestController;
 *
 * import com.model.dao.AutenticaDAO; import com.model.entity.Usuario; import
 * com.utils.JsonUtil;
 *
 * @RestController public class LoginController { //private static final long
 * serialVersionUID = 1L;
 *
 * private AutenticaDAO autenticaDAO;
 *
 * //@Override //public void init() throws ServletException { // DBConnection
 * dbConnection = (DBConnection)
 * getServletContext().getAttribute("dbConnection"); // if (dbConnection ==
 * null) { // throw new
 * ServletException("A conexão com o banco de dados não foi inicializada."); //
 * } // autenticaDAO = new AutenticaDAO(dbConnection); //}
 *
 * //@Override
 *
 * @PostMapping("/login") protected void doPost(HttpServletRequest request,
 * HttpServletResponse response) throws ServletException, IOException { String
 * email = request.getParameter("email"); String senha =
 * request.getParameter("senha");
 *
 * Usuario usuario = autenticaDAO.validarLogin(email, senha);
 *
 *
 * if (usuario != null) { HttpSession session = request.getSession();
 * session.setAttribute("usuario_id", usuario.getId());
 * session.setAttribute("usuario_nome", usuario.getNome());
 *
 * JsonUtil.sendJsonResponse(response, "success", "login ok"); } else {
 * JsonUtil.sendJsonResponse(response, "error", "Email ou senha inválidos."); }
 *
 * } }
 *---------------------------------------------------------------------------------------------------------------
 */
/*
 * package com.controller;
 * 
 * import org.springframework.beans.factory.annotation.Autowired; import
 * org.springframework.web.bind.annotation.PostMapping; import
 * org.springframework.web.bind.annotation.RequestParam; import
 * org.springframework.web.bind.annotation.RestController;
 * 
 * import com.model.dao.AutenticaDAO; import com.model.entity.Usuario;
 * 
 * @RestController public class LoginController {
 * 
 * @Autowired private AutenticaDAO autenticaDAO;
 * 
 * @PostMapping("/login") public String login(@RequestParam String
 * email, @RequestParam String senha) { Usuario usuario =
 * autenticaDAO.validarLogin(email, senha);
 * 
 * if (usuario != null) { return "Login OK - Usuário ID: " + usuario.getId() +
 * ", Nome: " + usuario.getNome(); } else { return
 * "Erro: Email ou senha inválidos"; } }
 * 
 * }-------------------------------------------------------------------------------------------------------------------------
 */

package com.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class LoginController {

    @PostMapping("/login")
    public String login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String senha = request.get("senha");

        if ("teste@dominio.com".equals(email) && "123456".equals(senha)) {
            return "Login OK - Usuário: " + email;
        } else {
            return "Erro: Email ou senha inválidos";
        }
    }
}
