package com.model.dto.moodle;


public class ActivityStatusDTO {
    private int cmid;
    private String modname;
    private int instance;
    private int state;
    private int timecompleted;
    private int tracking;
    private Boolean hascompletion;
    private Boolean isautomatic;
    private Boolean isoverallcomplete;
    private Boolean uservisible;
    
	public String getModname() {
		return switch (modname.toLowerCase()) {
		case "assign" -> "Atividade";
		case "quiz" -> "Questionário";
		case "url" -> "Link";
		case "forum" -> "Fórum de Discussão";
		case "page" -> "Página de Conteúdo";
		case "resource" -> "Recurso";
		default -> "Atividade";
		};
	}

	public void setModname(String modname) {
		this.modname = modname;
	}

	public int getCmid() {
		return cmid;
	}

	public void setCmid(int cmid) {
		this.cmid = cmid;
	}

	public int getInstance() {
		return instance;
	}

	public void setInstance(int instance) {
		this.instance = instance;
	}

	public int getState() {
		return state;
	}

	public void setState(int state) {
		this.state = state;
	}

	public int getTimecompleted() {
		return timecompleted;
	}

	public void setTimecompleted(int timecompleted) {
		this.timecompleted = timecompleted;
	}

	public int getTracking() {
		return tracking;
	}

	public void setTracking(int tracking) {
		this.tracking = tracking;
	}

	public Boolean getHascompletion() {
		return hascompletion;
	}

	public void setHascompletion(Boolean hascompletion) {
		this.hascompletion = hascompletion;
	}

	public Boolean getIsautomatic() {
		return isautomatic;
	}

	public void setIsautomatic(Boolean isautomatic) {
		this.isautomatic = isautomatic;
	}

	public Boolean getIsoverallcomplete() {
		return isoverallcomplete;
	}

	public void setIsoverallcomplete(Boolean isoverallcomplete) {
		this.isoverallcomplete = isoverallcomplete;
	}

	public Boolean getUservisible() {
		return uservisible;
	}

	public void setUservisible(Boolean uservisible) {
		this.uservisible = uservisible;
	}
	
	
  
    
}